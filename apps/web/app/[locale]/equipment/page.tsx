'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useEquipmentStore } from '@/lib/stores/equipment-store'
import { Button } from '@catchsmart/ui/src/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@catchsmart/ui/src/components/card'
import { EquipmentForm } from '@/components/equipment/equipment-form'
import { EquipmentList } from '@/components/equipment/equipment-list'
import { useRouter } from 'next/navigation'
import { EQUIPMENT_TYPES } from '@catchsmart/shared/src/constants'
import type { EquipmentItem } from '@catchsmart/shared'

export default function EquipmentPage() {
  const t = useTranslations()
  const router = useRouter()
  const { user, signOut, loading: authLoading } = useAuthStore()
  const { items, loading: equipmentLoading, fetchEquipment } = useEquipmentStore()
  
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<EquipmentItem | null>(null)
  const [filterType, setFilterType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Protect the route
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  // Fetch equipment on mount
  useEffect(() => {
    if (user) {
      fetchEquipment()
    }
  }, [user, fetchEquipment])

  if (authLoading || equipmentLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-flex h-8 w-8 animate-spin rounded-full border-4 border-solid border-cs-primary border-r-transparent align-[-0.125em]" />
          <p className="mt-4">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const handleEdit = (item: EquipmentItem) => {
    setEditingItem(item)
    setShowForm(true)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingItem(null)
    fetchEquipment()
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingItem(null)
  }

  const stats = {
    total: items.length,
    favorites: items.filter(i => i.isFavorite).length,
    byType: EQUIPMENT_TYPES.reduce((acc, type) => ({
      ...acc,
      [type]: items.filter(i => i.type === type).length
    }), {} as Record<string, number>)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('equipment.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {items.length} {items.length === 1 ? 'Ausrüstung' : 'Ausrüstungen'} • 
            {' '}{stats.favorites} {stats.favorites === 1 ? 'Favorit' : 'Favoriten'}
          </p>
        </div>
        <Button variant="outline" onClick={handleSignOut} size="sm">
          Sign Out
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        {EQUIPMENT_TYPES.slice(0, 4).map(type => (
          <Card 
            key={type} 
            className="cursor-pointer hover:shadow-lg transition-all"
            onClick={() => setFilterType(filterType === type ? 'all' : type)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t(`equipment.types.${type}`)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.byType[type] || 0}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      {showForm ? (
        <EquipmentForm
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
          initialData={editingItem || undefined}
          editMode={!!editingItem}
          equipmentId={editingItem?.id}
        />
      ) : (
        <>
          {/* Actions Bar */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder={t('common.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full max-w-md rounded-lg border border-input bg-background px-4 py-2 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="rounded-lg border border-input bg-background px-4 py-2 text-sm"
              >
                <option value="all">Alle Typen</option>
                {EQUIPMENT_TYPES.map(type => (
                  <option key={type} value={type}>
                    {t(`equipment.types.${type}`)}
                  </option>
                ))}
              </select>
              <Button onClick={() => setShowForm(true)}>
                {t('equipment.add.title')}
              </Button>
            </div>
          </div>

          {/* Equipment Grid or Empty State */}
          {items.length === 0 && !searchQuery && filterType === 'all' ? (
            <Card>
              <CardHeader className="text-center">
                <CardTitle>{t('equipment.empty.title')}</CardTitle>
                <CardDescription>
                  {t('equipment.empty.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button onClick={() => setShowForm(true)}>
                  {t('equipment.empty.cta')}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <EquipmentList
              onEdit={handleEdit}
              filterType={filterType}
              searchQuery={searchQuery}
            />
          )}
        </>
      )}
    </div>
  )
}
