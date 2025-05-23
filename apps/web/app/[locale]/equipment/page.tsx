'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'

export default function EquipmentPage() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string

  useEffect(() => {
    // Redirect to the equipment management page with new upload functionality
    router.replace(`/${locale}/equipment/manage`)
  }, [router, locale])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="inline-flex h-8 w-8 animate-spin rounded-full border-4 border-solid border-cs-primary border-r-transparent align-[-0.125em]" />
      </div>
    </div>
  )
}
