'use client'

import { useState, useCallback, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Upload, Camera, X, Loader2 } from 'lucide-react'
import { Button } from '@catchsmart/ui/src/components/button'
import { Card } from '@catchsmart/ui/src/components/card'
import { cn } from '@catchsmart/ui/src/lib/utils'

interface ImageUploadProps {
  onUpload: (file: File) => Promise<void>
  accept?: string
  maxSize?: number // in MB
  className?: string
}

export function ImageUpload({
  onUpload,
  accept = 'image/*',
  maxSize = 10,
  className
}: ImageUploadProps) {
  const t = useTranslations()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFile = useCallback(async (file: File) => {
    setError(null)

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Bitte nur Bilddateien hochladen')
      return
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Datei zu groß. Maximum: ${maxSize}MB`)
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    setIsUploading(true)
    try {
      await onUpload(file)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload fehlgeschlagen')
      setPreview(null)
    } finally {
      setIsUploading(false)
    }
  }, [onUpload, maxSize])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }, [handleFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }, [handleFile])

  const handleCameraCapture = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = 'image/*'
      fileInputRef.current.capture = 'environment'
      fileInputRef.current.click()
    }
  }, [])

  const clearUpload = useCallback(() => {
    setPreview(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all',
        isDragging && 'border-cs-primary bg-cs-primary/5',
        className
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        <div className="relative aspect-square">
          <img
            src={preview}
            alt="Upload preview"
            className="h-full w-full object-cover"
          />
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <Loader2 className="h-8 w-8 animate-spin text-cs-primary" />
            </div>
          )}
          {!isUploading && (
            <button
              onClick={clearUpload}
              className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5 hover:bg-background"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="mb-2 text-sm font-medium">
            Bild hier ablegen oder klicken zum Auswählen
          </p>
          <p className="mb-4 text-xs text-muted-foreground">
            Köder-Fotos oder Bestellungen/Quittungen
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Datei wählen
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleCameraCapture}
              className="md:hidden"
            >
              <Camera className="mr-2 h-4 w-4" />
              Foto
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="border-t bg-cs-error/10 p-3 text-sm text-cs-error">
          {error}
        </div>
      )}
    </Card>
  )
}
