/**
 * lib/push/sendPush.ts
 *
 * Sends Expo push notifications to users and saves them in the notifications table.
 * Uses Expo's free push notification service — no additional accounts needed.
 *
 * Usage:
 *   import { sendPushToUser } from '@/lib/push/sendPush'
 *   await sendPushToUser(adminClient, userId, {
 *     title: 'Case Update',
 *     body: 'Your case OSIS-2026-001 has been updated.',
 *     type: 'case_update',
 *     data: { caseId: '...' },
 *   })
 */

import { SupabaseClient } from '@supabase/supabase-js'

export type NotificationType =
  | 'case_update'
  | 'case_opened'
  | 'appointment'
  | 'ticket_reply'
  | 'general'

export interface PushPayload {
  title: string
  body: string
  type: NotificationType
  data?: Record<string, string>
}

/**
 * Send a push notification to a specific user.
 * Looks up their Expo push tokens and sends via Expo's API.
 * Also saves the notification to the notifications table for the in-app centre.
 */
export async function sendPushToUser(
  adminClient: SupabaseClient,
  userId: string,
  payload: PushPayload
): Promise<void> {
  try {
    // 1. Save to notifications table (in-app notification centre)
    await adminClient.from('notifications').insert({
      user_id: userId,
      title: payload.title,
      body: payload.body,
      type: payload.type,
      data: payload.data ?? {},
      is_read: false,
    })

    // 2. Get user's push tokens
    const { data: tokenRows } = await adminClient
      .from('push_tokens')
      .select('token')
      .eq('user_id', userId)

    if (!tokenRows || tokenRows.length === 0) return

    const tokens = tokenRows.map((row: { token: string }) => row.token)

    // 3. Send via Expo Push API (free, no account needed)
    const messages = tokens.map(token => ({
      to: token,
      title: payload.title,
      body: payload.body,
      data: payload.data ?? {},
      sound: 'default',
      badge: 1,
    }))

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
      },
      body: JSON.stringify(messages),
    })
  } catch (error) {
    // Never throw — push notifications are best-effort
    console.error('Push notification error:', error)
  }
}
