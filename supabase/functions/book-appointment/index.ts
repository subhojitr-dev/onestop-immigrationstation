// ============================================================
// Edge Function: book-appointment
// Replaces: add-book-slot.php
// ============================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Get authenticated user
    const authHeader = req.headers.get('Authorization')
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader?.replace('Bearer ', '') ?? ''
    )
    if (authError || !user) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const body = await req.json()
    const { date, time_slot, case_id, notes } = body

    // Check free sessions remaining (max 2 per user)
    const { count: usedFree } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_free', true)

    const freeRemaining = Math.max(0, 2 - (usedFree ?? 0))
    const isFree = freeRemaining > 0
    const freeSessionNumber = isFree ? ((usedFree ?? 0) + 1) : null

    // Check slot availability
    const { data: existing } = await supabase
      .from('appointments')
      .select('id')
      .eq('date', date)
      .eq('time_slot', time_slot)
      .neq('status', 'cancelled')

    if (existing && existing.length > 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'This time slot is already booked' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create appointment
    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert({
        user_id: user.id,
        case_id: case_id || null,
        date,
        time_slot,
        status: 'pending',
        is_free: isFree,
        free_session_number: freeSessionNumber,
        notes: notes || null,
      })
      .select()
      .single()

    if (error) throw error

    // TODO: Send confirmation email via SendGrid

    return new Response(
      JSON.stringify({
        success: true,
        data: appointment,
        message: isFree
          ? `Appointment booked! This is your free session ${freeSessionNumber} of 2.`
          : 'Appointment booked successfully.',
        free_sessions_remaining: Math.max(0, freeRemaining - 1),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
