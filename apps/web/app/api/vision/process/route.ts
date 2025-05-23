import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Initialize Brave Search for product images
const BRAVE_API_KEY = process.env.BRAVE_SEARCH_API_KEY!

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
    const visionResult = await processWithVision(buffer)

    // Use AI to find product images for extracted items
    for (const item of visionResult.items) {
      if (!item.imageUrl && item.name) {
        item.imageUrl = await findProductImage(item)
      }
    }

    return NextResponse.json({
      success: true,
      imageUrl: publicUrl,
      vision: visionResult,
    })

  } catch (error) {
    console.error('Vision API error:', error)
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    )
  }
}

async function processWithVision(imageBuffer: Buffer): Promise<VisionResult> {
  // For now, using a mock implementation
  // In production, this would use Google Cloud Vision API
  
  // TODO: Replace with actual Google Vision API calls
  const mockText = "Rapala Original Floater F11 Silver 11cm"
  const isReceipt = false
  
  if (isReceipt) {
    return processReceipt(mockText)
  } else {
    return processLureImage(mockText)
  }
}

async function processReceipt(text: string): Promise<VisionResult> {
  const items: ExtractedItem[] = []
  
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
          brand: extractBrand(productName),
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

async function processLureImage(text: string): Promise<VisionResult> {
  const items: ExtractedItem[] = []
  
  // Extract product info from text
  const nameMatch = text.match(/([A-Za-z]+\s+[A-Za-z0-9\s\-]+)/)?.[1]
  const sizeMatch = text.match(/(\d+(?:cm|mm|g))/i)?.[1]
  const colorWords = text.match(/(rot|blau|grün|gelb|schwarz|weiß|silber|gold|red|blue|green|yellow|black|white|silver|gold|orange|pink|chartreuse)/gi)
  
  const item: ExtractedItem = {
    name: nameMatch?.trim() || 'Unbekannter Köder',
    brand: extractBrand(text),
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
  try {
    // Build search query
    const searchQuery = `${item.brand || ''} ${item.name} ${item.model || ''} fishing lure product image`.trim()
    
    // Search using Brave API
    const response = await fetch('https://api.search.brave.com/res/v1/images/search', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': BRAVE_API_KEY
      },
      // @ts-ignore - URLSearchParams works in Node.js
      searchParams: new URLSearchParams({
        q: searchQuery,
        count: '5',
        safesearch: 'moderate',
      })
    })

    if (!response.ok) {
      console.error('Brave search failed:', response.statusText)
      return undefined
    }

    const data = await response.json()
    
    // Find the best image result
    const results = data.results || []
    for (const result of results) {
      // Prefer images from known fishing retailers or manufacturer sites
      const trustedDomains = ['rapala.com', 'mepps.com', 'savage-gear.com', 'berkley-fishing.com', 'amazon.com', 'angelplatz.de', 'anglermarkt.de']
      const url = new URL(result.url || '')
      
      if (trustedDomains.some(domain => url.hostname.includes(domain))) {
        return result.thumbnail?.src || result.url
      }
    }
    
    // Return first result if no trusted domain found
    return results[0]?.thumbnail?.src || results[0]?.url
    
  } catch (error) {
    console.error('Product image search failed:', error)
    return undefined
  }
}
