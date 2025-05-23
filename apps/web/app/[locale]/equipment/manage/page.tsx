'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Plus, Search, Filter, Camera, FileText } from 'lucide-react'
import { Button } from '@catchsmart/ui/src/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, EquipmentCard } from '@catchsmart/ui/src/components/card'
import { ImageUpload } from '@/components/equipment/image-upload'
import { EquipmentForm } from '@/components/equipment/equipment-form'
import { useAuthStore } from '@/lib/stores/auth-store'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@catchsmart/database/types/database'

type Equipment = Database['public']['Tables']['equipment_items']['Row']
type ExtractedItem = {
  name: string
  brand?: string
  model?: string
  color?: string
  size?: string
  price?: number
  imageUrl?: string
}

export default function EquipmentManagementPage() {
  const t = useTranslations()
  const { user } = useAuthStore()
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showUpload, setShowUpload] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ExtractedItem | null>(null)
  const [uploadMode, setUploadMode] = useState<'single' | 'bulk'>('single')
  const [extractedItems, setExtractedItems] = useState<ExtractedItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [authStatus, setAuthStatus] = useState<any>(null)

  // Load equipment on mount
  useEffect(() => {
    if (user) {
      loadEquipment()
      // Test auth status when component mounts
      testAuthStatus()
    }
  }, [user])

  const testAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/test', {
        credentials: 'include'
      })
      const data = await response.json()
      setAuthStatus(data)
      console.log('Auth status:', data)
    } catch (error) {
      console.error('Auth test failed:', error)
    }
  }

  const loadEquipment = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('equipment_items')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setEquipment(data)
    }
    setIsLoading(false)
  }

  const handleImageUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    
    setUploadError(null)

    try {
      console.log('Uploading file:', file.name, 'Size:', file.size)
      
      // Important: Include credentials to send cookies
      const response = await fetch('/api/vision/process', {
        method: 'POST',
        body: formData,
        credentials: 'include', // This ensures cookies are sent
      })

      const result = await response.json()
      
      if (!response.ok) {
        console.error('Server error:', result)
        throw new Error(result.error || `Server error: ${response.status}`)
      }

      console.log('Upload successful:', result)
      
      if (result.vision.type === 'receipt') {
        // Multiple items from receipt
        setExtractedItems(result.vision.items)
        setUploadMode('bulk')
        setShowUpload(false)
      } else {
        // Single lure item
        const item = result.vision.items[0]
        if (item) {
          // Add the uploaded image URL to the item
          item.imageUrl = result.imageUrl
          setSelectedItem(item)
          setShowForm(true)
          setShowUpload(false)
        } else {
          throw new Error('No items detected in image')
        }
      }
    } catch (error) {
      console.error('Upload error:', error)
      setUploadError(error instanceof Error ? error.message : 'Upload failed')
    }
  }

  const handleSaveEquipment = async (data: Partial<Equipment>) => {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('equipment_items')
      .insert({
        ...data,
        user_id: user?.id!,
      })

    if (!error) {
      await loadEquipment()
      setShowForm(false)
      setSelectedItem(null)
    }
  }

  const handleSaveBulkItems = async () => {
    const supabase = createClient()
    
    const items = extractedItems.map(item => ({
      user_id: user?.id!,
      name: item.name,
      type: 'lure' as const,
      brand: item.brand,
      model: item.model,
      color: item.color,
      size: item.size,
      image_url: item.imageUrl,
      purchase_info: item.price ? { price: item.price } : {},
      attributes: {},
      tags: [],
      is_favorite: false,
      condition: 'new' as const,
    }))

    const { error } = await supabase
      .from('equipment_items')
      .insert(items)

    if (!error) {
      await loadEquipment()
      setExtractedItems([])
      setUploadMode('single')
    }
  }

  const filteredEquipment = equipment.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (showUpload) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => {
              setShowUpload(false)
              setUploadError(null)
            }}
            className="mb-4"
          >
            ← Zurück
          </Button>
          <h1 className="text-2xl font-bold mb-2">Equipment hinzufügen</h1>
          <p className="text-muted-foreground">
            Fotografiere deinen Köder oder lade eine Bestellung/Quittung hoch
          </p>
        </div>

        <div className="grid gap-4 mb-6">
          <Button
            variant={uploadMode === 'single' ? 'default' : 'outline'}
            onClick={() => setUploadMode('single')}
            className="justify-start"
          >
            <Camera className="mr-2 h-4 w-4" />
            Einzelnen Köder fotografieren
          </Button>
          <Button
            variant={uploadMode === 'bulk' ? 'default' : 'outline'}
            onClick={() => setUploadMode('bulk')}
            className="justify-start"
          >
            <FileText className="mr-2 h-4 w-4" />
            Bestellung/Quittung hochladen
          </Button>
        </div>

        {uploadError && (
          <div className="mb-4 p-4 bg-cs-error/10 text-cs-error rounded-lg">
            <p className="font-semibold">Upload fehlgeschlagen</p>
            <p className="text-sm">{uploadError}</p>
          </div>
        )}

        <ImageUpload
          onUpload={handleImageUpload}
          accept="image/*"
          maxSize={10}
        />

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            {uploadMode === 'single' 
              ? 'Tipp: Fotografiere den Köder vor einem einfachen Hintergrund für beste Ergebnisse'
              : 'Tipp: Stelle sicher, dass die Produktnamen gut lesbar sind'
            }
          </p>
          <Button
            variant="ghost"
            onClick={() => {
              setShowUpload(false)
              setShowForm(true)
              setUploadError(null)
            }}
          >
            Manuell eingeben →
          </Button>
        </div>
      </div>
    )
  }

  if (showForm && !extractedItems.length) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <EquipmentForm
          initialData={selectedItem}
          onSave={handleSaveEquipment}
          onCancel={() => {
            setShowForm(false)
            setSelectedItem(null)
          }}
        />
      </div>
    )
  }

  if (extractedItems.length > 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Erkannte Produkte</h1>
          <p className="text-muted-foreground">
            {extractedItems.length} Produkte wurden auf der Quittung erkannt
          </p>
        </div>

        <div className="grid gap-4 mb-6">
          {extractedItems.map((item, index) => (
            <Card key={index}>
              <CardContent className="flex items-center gap-4 p-4">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {[item.brand, item.model, item.color, item.size].filter(Boolean).join(' • ')}
                  </p>
                  {item.price && (
                    <p className="text-sm font-medium mt-1">€{item.price.toFixed(2)}</p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedItem(item)
                    setExtractedItems(extractedItems.filter((_, i) => i !== index))
                    setShowForm(true)
                  }}
                >
                  Bearbeiten
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-4">
          <Button
            onClick={handleSaveBulkItems}
            className="flex-1"
          >
            Alle {extractedItems.length} Produkte speichern
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setExtractedItems([])
              setUploadMode('single')
            }}
          >
            Abbrechen
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">{t('equipment.title')}</h1>
        <Button onClick={() => setShowUpload(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('equipment.add.title')}
        </Button>
      </div>

      {/* Debug Auth Status - Remove in production */}
      {authStatus && process.env.NODE_ENV === 'development' && (
        <Card className="mb-6 bg-muted/50">
          <CardHeader>
            <CardTitle className="text-sm">Auth Debug Info</CardTitle>
          </CardHeader>
          <CardContent className="text-xs font-mono">
            <pre>{JSON.stringify(authStatus, null, 2)}</pre>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t('common.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-cs-primary"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Equipment Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="h-64 animate-pulse bg-muted" />
          ))}
        </div>
      ) : filteredEquipment.length === 0 ? (
        <Card>
          <CardHeader className="text-center">
            <CardTitle>{t('equipment.empty.title')}</CardTitle>
            <CardDescription>
              {t('equipment.empty.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => setShowUpload(true)}>
              {t('equipment.empty.cta')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredEquipment.map((item) => (
            <EquipmentCard
              key={item.id}
              title={item.name}
              subtitle={[item.brand, item.size].filter(Boolean).join(' • ')}
              image={item.image_url || undefined}
              favorite={item.is_favorite || false}
              onFavoriteToggle={() => {
                // TODO: Implement favorite toggle
              }}
              onClick={() => {
                // TODO: Show equipment details
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
