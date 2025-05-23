require('dotenv').config({ path: '../../.env.local' })
const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for admin access
)

async function seed() {
  console.log('🌱 Starting database seed...')

  try {
    // Create test user (if using Supabase Auth)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'test@catchsmart.app',
      password: 'testpassword123',
      email_confirm: true,
      user_metadata: {
        full_name: 'Test Angler'
      }
    })

    if (authError && !authError.message.includes('already exists')) {
      throw authError
    }

    const userId = authData?.user?.id || 'existing-user-id'
    console.log('✅ Test user ready:', userId)

    // Add some test equipment
    const equipment = [
      {
        user_id: userId,
        name: 'Rapala Original Floater F11',
        type: 'lure',
        brand: 'Rapala',
        model: 'Original Floater',
        color: 'Silver',
        size: '11cm',
        weight: 6,
        attributes: { 
          lure_type: 'wobbler',
          diving_depth: '1.2-1.8m',
          hooks: 2
        },
        tags: ['wobbler', 'hecht', 'barsch'],
        is_favorite: true,
        condition: 'good'
      },
      {
        user_id: userId,
        name: 'Mepps Aglia Nr. 3',
        type: 'lure',
        brand: 'Mepps',
        model: 'Aglia',
        color: 'Kupfer',
        size: 'Nr. 3',
        weight: 6.5,
        attributes: { 
          lure_type: 'spinner',
          blade_type: 'round'
        },
        tags: ['spinner', 'forelle', 'barsch'],
        is_favorite: false,
        condition: 'new'
      },
      {
        user_id: userId,
        name: 'Shimano Stradic 2500',
        type: 'reel',
        brand: 'Shimano',
        model: 'Stradic FL',
        attributes: { 
          gear_ratio: '6.0:1',
          bearings: 6,
          line_capacity: '0.25mm/160m'
        },
        tags: ['spinning', 'salzwasser-geeignet'],
        is_favorite: true,
        condition: 'good'
      }
    ]

    const { error: equipError } = await supabase
      .from('equipment_items')
      .insert(equipment)

    if (equipError) throw equipError
    console.log('✅ Equipment added')

    // Add a test fishing trip
    const { data: tripData, error: tripError } = await supabase
      .from('fishing_trips')
      .insert({
        user_id: userId,
        title: 'Morgen-Session am Zürichsee',
        location: 'POINT(8.541694 47.366667)', // Zürich coordinates
        location_name: 'Zürichsee - Hafen Riesbach',
        water_type: 'freshwater',
        started_at: new Date().toISOString(),
        weather_data: {
          temperature: 18,
          wind_speed: 12,
          wind_direction: 270,
          conditions: 'partly_cloudy'
        },
        target_species: ['hecht', 'barsch', 'zander']
      })
      .select()
      .single()

    if (tripError) throw tripError
    console.log('✅ Fishing trip added')

    // Add a test catch
    const { error: catchError } = await supabase
      .from('catches')
      .insert({
        trip_id: tripData.id,
        user_id: userId,
        species: 'Hecht',
        weight: 3.2,
        length: 72,
        equipment_used: [], // Would be equipment IDs
        bait_used: 'Rapala Original Floater F11',
        technique: 'Schleppen',
        depth: 2.5,
        notes: 'Biss direkt am Schilfrand',
        weather_conditions: {
          temperature: 18,
          conditions: 'partly_cloudy'
        },
        is_released: true,
        rating: 5,
        caught_at: new Date().toISOString()
      })

    if (catchError) throw catchError
    console.log('✅ Catch recorded')

    console.log('🎉 Seed completed successfully!')

  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

// Run the seed
seed().then(() => {
  console.log('✨ Done!')
  process.exit(0)
})
