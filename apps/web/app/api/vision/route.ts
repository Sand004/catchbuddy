import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ImageAnnotatorClient } from '@google-cloud/vision'

// Initialize Google Vision client
const vision = new ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_CLOUD_KEYFILE,
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
})

interface VisionResult {
  type: 'lure' | 'receipt'
  items: ExtractedItem[]
  rawText?: string
}

interface ExtractedItem {
  name: string
  brand?: string
  model?: string
  color?: string
  size?: string
  price?: number
  quantity?: number
  imageUrl?: string
  confidence: number
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get file from request
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Supabase Storage
    const fileName = `${user.id}/${Date.now()}-${file.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('equipment-images')
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
      })

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('equipment-images')
      .getPublicUrl(fileName)

    // Process with Google Vision API
    const [textResult] = await vision.textDetection({ image: { content: buffer } })
    const [labelResult] = await vision.labelDetection({ image: { content: buffer } })
    const [logoResult] = await vision.logoDetection({ image: { content: buffer } })
    const [objectResult] = await vision.objectLocalization({ image: { content: buffer } })

    // Extract text
    const fullText = textResult.textAnnotations?.[0]?.description || ''
    
    // Determine if it's a receipt or direct lure photo
    const isReceipt = fullText.toLowerCase().includes('rechnung') || 
                     fullText.toLowerCase().includes('quittung') ||
                     fullText.toLowerCase().includes('receipt') ||
                     fullText.toLowerCase().includes('invoice') ||
                     fullText.toLowerCase().includes('order')

    // Process based on type
    let result: VisionResult
    
    if (isReceipt) {
      result = await processReceipt(fullText, logoResult)
    } else {
      result = await processLureImage(fullText, labelResult, logoResult, objectResult)
    }

    // Use AI to find product images for extracted items
    for (const item of result.items) {
      if (!item.imageUrl && item.name) {
        item.imageUrl = await findProductImage(item)
      }
    }

    return NextResponse.json({
      success: true,
      imageUrl: publicUrl,
      vision: result,
    })

  } catch (error) {
    console.error('Vision API error:', error)
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    )
  }
}

async function processReceipt(text: string, logoResult: any): Promise<VisionResult> {
  const items: ExtractedItem[] = []
  
  // Extract brand from logos
  const brands = logoResult.logoAnnotations?.map((logo: any) => logo.description) || []
  
  // Parse receipt text for fishing equipment
  const lines = text.split('\n')
  const productPattern = /([A-Za-z\s\-]+)\s+(\d+[\.,]\d{2})/
  const fishingKeywords = ['wobbler', 'spinner', 'köder', 'lure', 'rute', 'rod', 'rolle', 'reel', 'schnur', 'line', 'haken', 'hook', 'bait']
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase()
    
    // Check if line contains fishing-related keywords
    if (fishingKeywords.some(keyword => lowerLine.includes(keyword))) {
      const match = line.match(productPattern)
      if (match) {
        const [, productName, price] = match
        
        // Try to extract more details from product name
        const item: ExtractedItem = {
          name: productName.trim(),
          price: parseFloat(price.replace(',', '.')),
          brand: brands[0] || extractBrand(productName),
          confidence: 0.8
        }
        
        // Extract size if present
        const sizeMatch = productName.match(/(\d+(?:cm|mm|g|kg|lb|oz))/i)
        if (sizeMatch) {
          item.size = sizeMatch[1]
        }
        
        // Extract color if present
        const colorMatch = productName.match(/(rot|blau|grün|gelb|schwarz|weiß|silber|gold|red|blue|green|yellow|black|white|silver|gold)/i)
        if (colorMatch) {
          item.color = colorMatch[1]
        }
        
        items.push(item)
      }
    }
  }
  
  return {
    type: 'receipt',
    items,
    rawText: text
  }
}

async function processLureImage(text: string, labelResult: any, logoResult: any, objectResult: any): Promise<VisionResult> {
  const items: ExtractedItem[] = []
  
  // Extract brand from logos
  const brand = logoResult.logoAnnotations?.[0]?.description
  
  // Extract labels
  const labels = labelResult.labelAnnotations?.map((label: any) => label.description.toLowerCase()) || []
  
  // Determine lure type from labels
  const lureTypes = ['lure', 'spinner', 'wobbler', 'spoon', 'jig', 'bait']
  const detectedType = labels.find(label => lureTypes.includes(label))
  
  // Extract product info from text
  const nameMatch = text.match(/([A-Za-z]+\s+[A-Za-z0-9\s\-]+)/)?.[1]
  const sizeMatch = text.match(/(\d+(?:cm|mm|g))/i)?.[1]
  const colorWords = text.match(/(rot|blau|grün|gelb|schwarz|weiß|silber|gold|red|blue|green|yellow|black|white|silver|gold|orange|pink|chartreuse)/gi)
  
  const item: ExtractedItem = {
    name: nameMatch?.trim() || detectedType || 'Unbekannter Köder',
    brand: brand || extractBrand(text),
    size: sizeMatch,
    color: colorWords?.[0],
    confidence: 0.9
  }
  
  // Extract model if present
  const modelMatch = text.match(/(?:model|modell|type|typ)[\s:]*([A-Za-z0-9\-]+)/i)
  if (modelMatch) {
    item.model = modelMatch[1]
  }
  
  items.push(item)
  
  return {
    type: 'lure',
    items,
    rawText: text
  }
}

function extractBrand(text: string): string | undefined {
  // Known fishing brands
  const brands = [
    'Rapala', 'Mepps', 'Savage Gear', 'Abu Garcia', 'Shimano', 'Daiwa',
    'Berkley', 'Strike King', 'Storm', 'Blue Fox', 'Panther Martin',
    'Yo-Zuri', 'Lucky Craft', 'Megabass', 'Deps', 'Jackall', 'Balzer',
    'Spro', 'Fox Rage', 'Westin', 'Illex', 'Gunki', 'Salmo', 'Dam'
  ]
  
  const lowerText = text.toLowerCase()
  return brands.find(brand => lowerText.includes(brand.toLowerCase()))
}

async function findProductImage(item: ExtractedItem): Promise<string | undefined> {
  // This would use Brave Search API to find product images
  // For now, returning undefined - to be implemented with Brave Search
  
  // TODO: Implement with Brave Search API
  // const searchQuery = `${item.brand || ''} ${item.name} ${item.model || ''} fishing lure`.trim()
  // const results = await braveSearch(searchQuery, { type: 'images' })
  // return results[0]?.thumbnail
  
  return undefined
}
