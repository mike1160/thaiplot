import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function linkThanyai() {
  let userId: string | null = null

  // 1. Create auth user for Thanyai (or find existing)
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: 'thanyai@thaiplot.com',
    password: 'ThaiPlot2024!',
    email_confirm: true,
    user_metadata: { full_name: 'Thanyai' },
  })

  if (authError) {
    // User may already exist — look them up
    const { data: listData, error: listError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    })
    if (listError) {
      console.error('Auth error:', authError)
      console.error('List users error:', listError)
      return
    }
    const existing = listData.users.find(
      (u: { id: string; email?: string }) => u.email === 'thanyai@thaiplot.com'
    )
    if (!existing) {
      console.error('Auth error:', authError)
      console.error(
        '\nHint: If you see "Database error creating new user", run\n' +
          '  supabase/fix-profiles-role.sql\n' +
          'in the Supabase SQL Editor, then re-run this script.\n' +
          '(Legacy profiles table is missing full_name/role columns.)\n'
      )
      return
    }
    userId = existing.id
    console.log('User already exists:', userId)
  } else {
    userId = authData.user.id
    console.log('Created user:', userId)
  }

  // 2. Link all existing listings to this user_id
  const { data: updated, error: updateError } = await supabase
    .from('listings')
    .update({ user_id: userId })
    .is('user_id', null)
    .select('id')

  if (updateError) {
    console.error('Update error:', updateError)
    return
  }
  console.log(`Linked ${updated?.length ?? 0} listings to Thanyai successfully`)
}

linkThanyai()
