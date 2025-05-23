import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Google Vision API configuration
const GOOGLE_API_KEY = process.env.GOOGLE_CLOUD_API_KEY!
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
  console.log('=== Vision API called ===')
  
  try {
    // Use the same createClient function as other parts of the app
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    console.log('Auth check:', { 
      hasUser: !!user, 
      userId: user?.id,
      error: authError?.message 
    })
    
    if (authError || !user) {
      console.error('Auth failed:', authError || 'No user found')
      return NextResponse.json(
        { error: 'Unauthorized - Please log in again' }, 
        { status: 401 }
      )
    }

    // Get file from request
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    console.log('Processing file:', file.name, 'Size:', file.size, 'Type:', file.type)

    // Convert file to base64 for Google Vision API
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')

    // Upload to Supabase Storage
    const fileName = `${user.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    console.log('Uploading to storage:', fileName)
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('equipment-images')
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      // Check if bucket exists
      if (uploadError.message.includes('bucket')) {
        return NextResponse.json(
          { error: 'Storage bucket "equipment-images" not found. Please create it in Supabase.' },
          { status: 500 }
        )
      }
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    console.log('File uploaded successfully:', uploadData.path)

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('equipment-images')
      .getPublicUrl(uploadData.path)

    console.log('Public URL:', publicUrl)

    // Process with Google Vision REST API
    let visionResult: VisionResult

    if (GOOGLE_API_KEY && GOOGLE_API_KEY !== 'your-google-cloud-api-key') {
      console.log('Processing with Google Vision API...')
      visionResult = await processWithGoogleVision(base64Image)
    } else {
      console.warn('Google Vision API key not configured, using mock data')
      console.log('Set GOOGLE_CLOUD_API_KEY in your .env.local file')
      visionResult = await processWithMockData(base64Image)
    }

    console.log('Vision processing complete:', visionResult)

    // Use Brave Search to find product images for extracted items
    if (BRAVE_API_KEY && BRAVE_API_KEY !== 'your-brave-api-key' && visionResult.items.length > 0) {
      console.log('Searching for product images...')
      for (const item of visionResult.items) {
        if (!item.imageUrl && item.name) {
          try {
            item.imageUrl = await findProductImage(item)
          } catch (error) {
            console.error('Image search failed for item:', item.name, error)
            // Continue without image
          }
        }
      }
    }

    const response = {
      success: true,
      imageUrl: publicUrl,
      vision: visionResult,
    }

    console.log('Sending successful response')

    return NextResponse.json(response)

  } catch (error) {
    console.error('Vision API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process image' },
      { status: 500 }
    )
  }
}

async function processWithGoogleVision(base64Image: string): Promise<VisionResult> {
  try {
    console.log('Calling Google Vision API...')
    
    // Call Google Vision REST API
    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [{
            image: { content: base64Image },
            features: [
              { type: 'TEXT_DETECTION', maxResults: 10 },
              { type: 'LABEL_DETECTION', maxResults: 10 },
              { type: 'LOGO_DETECTION', maxResults: 5 },
              { type: 'OBJECT_LOCALIZATION', maxResults: 10 }
            ]
          }]
        })
      }
    )

    if (!response.ok) {
      const error = await response.json()
      console.error('Google Vision API error:', error)
      throw new Error(`Google Vision API error: ${error.error?.message || response.statusText}`)
    }

    const data = await response.json()
    const result = data.responses[0]

    console.log('Vision API response:', {
      hasText: !!result.textAnnotations?.length,
      hasLabels: !!result.labelAnnotations?.length,
      hasLogos: !!result.logoAnnotations?.length,
      hasObjects: !!result.localizedObjectAnnotations?.length
    })

    // Extract text
    const fullText = result.textAnnotations?.[0]?.description || ''
    const labels = result.labelAnnotations?.map((label: any) => label.description.toLowerCase()) || []
    const logos = result.logoAnnotations?.map((logo: any) => logo.description) || []
    
    // Determine if it's a receipt or direct lure photo
    const isReceipt = fullText.toLowerCase().includes('rechnung') || 
                     fullText.toLowerCase().includes('quittung') ||
                     fullText.toLowerCase().includes('receipt') ||
                     fullText.toLowerCase().includes('invoice') ||
                     fullText.toLowerCase().includes('order') ||
                     labels.includes('receipt') ||
                     labels.includes('document')

    console.log('Document type:', isReceipt ? 'receipt' : 'lure', 'Text found:', fullText.substring(0, 100))

    if (isReceipt) {
      return processReceipt(fullText, logos)
    } else {
      return processLureImage(fullText, labels, logos)
    }
  } catch (error) {
    console.error('Google Vision processing error:', error)
    // Fallback to mock data if Vision API fails
    return processWithMockData(base64Image)
  }
}

async function processWithMockData(base64Image: string): Promise<VisionResult> {
  // Mock implementation for development
  console.log('Using mock data for testing')
  
  // Simulate some delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const mockItems = [
    {
      name: 'Rapala Original Floater F11',
      brand: 'Rapala',
      model: 'Original Floater',
      color: 'Silver',
      size: '11cm',
      confidence: 0.9
    },
    {
      name: 'Mepps Aglia Nr. 3',
      brand: 'Mepps',
      model: 'Aglia',
      color: 'Kupfer',
      size: 'Nr. 3',
      confidence: 0.85
    }
  ]
  
  // Return single item for lure photo
  return {
    type: 'lure',
    items: [mockItems[0]],
    rawText: 'Mock detection: Rapala Original Floater F11 Silver'
  }
}

function processReceipt(text: string, logos: string[]): VisionResult {
  console.log('Processing receipt...')
  const items: ExtractedItem[] = []
  
  // Parse receipt text for fishing equipment
  const lines = text.split('\n')
  const productPattern = /([A-Za-z\s\-]+\w+)\s+(\d+[.,]\d{2})/
  const fishingKeywords = ['wobbler', 'spinner', 'köder', 'lure', 'rute', 'rod', 'rolle', 'reel', 'schnur', 'line', 'haken', 'hook', 'bait', 'rapala', 'mepps', 'berkley']
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lowerLine = line.toLowerCase()
    
    // Check if line contains fishing-related keywords
    if (fishingKeywords.some(keyword => lowerLine.includes(keyword))) {
      const match = line.match(productPattern)
      if (match) {
        const [, productName, price] = match
        
        const item: ExtractedItem = {
          name: productName.trim(),
          price: parseFloat(price.replace(',', '.')),
          brand: logos[0] || extractBrand(productName),
          confidence: 0.8
        }
        
        // Extract size if present
        const sizeMatch = productName.match(/(\d+(?:cm|mm|g|kg|lb|oz))/i)
        if (sizeMatch) {
          item.size = sizeMatch[1]
        }
        
        // Extract color if present
        const colorMatch = productName.match(/(rot|blau|grün|gelb|schwarz|weiß|silber|gold|red|blue|green|yellow|black|white|silver|gold|orange|pink|chartreuse)/i)
        if (colorMatch) {
          item.color = colorMatch[1]
        }
        
        items.push(item)
        console.log('Found product:', item)
      }
    }
  }
  
  console.log(`Found ${items.length} products in receipt`)
  
  return {
    type: 'receipt',
    items,
    rawText: text
  }
}

function processLureImage(text: string, labels: string[], logos: string[]): VisionResult {
  console.log('Processing lure image...')
  const items: ExtractedItem[] = []
  
  // Extract brand from logos
  const brand = logos[0] || extractBrand(text)
  
  // Extract product info from text
  const lines = text.split('\n').filter(line => line.trim())
  const productName = lines[0] || 'Unbekannter Köder'
  
  const sizeMatch = text.match(/(\d+(?:cm|mm|g))/i)?.[1]
  const colorWords = text.match(/(rot|blau|grün|gelb|schwarz|weiß|silber|gold|red|blue|green|yellow|black|white|silver|gold|orange|pink|chartreuse|firetiger|perch|pike)/gi)
  
  const item: ExtractedItem = {
    name: productName.trim(),
    brand: brand,
    size: sizeMatch,
    color: colorWords?.[0],
    confidence: 0.9
  }
  
  // Extract model if present
  const modelMatch = text.match(/(?:model|modell|type|typ)[\s:]*([A-Za-z0-9\-]+)/i)
  if (modelMatch) {
    item.model = modelMatch[1]
  }
  
  // Use labels to enhance item type
  if (labels.includes('spinner') || labels.includes('spinnerbait')) {
    item.name = `${item.name} (Spinner)`
  } else if (labels.includes('wobbler') || labels.includes('crankbait')) {
    item.name = `${item.name} (Wobbler)`
  }
  
  items.push(item)
  console.log('Extracted lure:', item)
  
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
    'Spro', 'Fox Rage', 'Westin', 'Illex', 'Gunki', 'Salmo', 'Dam',
    'Decathlon', 'Caperlan', 'Penn', 'Okuma', 'Mitchell', 'Quantum'
  ]
  
  const lowerText = text.toLowerCase()
  return brands.find(brand => lowerText.includes(brand.toLowerCase()))
}

async function findProductImage(item: ExtractedItem): Promise<string | undefined> {
  try {
    // Build search query
    const searchQuery = `${item.brand || ''} ${item.name} ${item.model || ''} fishing lure product image`.trim()
    console.log('Searching for product image:', searchQuery)
    
    // Search using Brave API
    const url = new URL('https://api.search.brave.com/res/v1/images/search')
    url.searchParams.append('q', searchQuery)
    url.searchParams.append('count', '5')
    url.searchParams.append('safesearch', 'moderate')

    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': BRAVE_API_KEY
      }
    })

    if (!response.ok) {
      console.error('Brave search failed:', response.statusText)
      return undefined
    }

    const data = await response.json()
    
    // Find the best image result
    const results = data.results || []
    console.log(`Found ${results.length} image results`)
    
    for (const result of results) {
      // Prefer images from known fishing retailers or manufacturer sites
      const trustedDomains = [
        'rapala.com', 'mepps.com', 'savage-gear.com', 'berkley-fishing.com',
        'amazon.com', 'angelplatz.de', 'anglermarkt.de', 'fishingtackle24.de',
        'decathlon.de', 'askari-sport.com'
      ]
      
      try {
        const url = new URL(result.url || '')
        if (trustedDomains.some(domain => url.hostname.includes(domain))) {
          console.log('Found trusted image:', url.hostname)
          return result.thumbnail?.src || result.url
        }
      } catch (e) {
        // Invalid URL, skip
      }
    }
    
    // Return first result if no trusted domain found
    const imageUrl = results[0]?.thumbnail?.src || results[0]?.url
    if (imageUrl) {
      console.log('Using first available image')
    }
    return imageUrl
    
  } catch (error) {
    console.error('Product image search failed:', error)
    return undefined
  }
}
