import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'
import { supabase } from './supabase'

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

/**
 * Request notification permissions and register the push token in Supabase.
 * Call this once after the user logs in.
 */
export async function registerForPushNotifications(userId: string): Promise<string | null> {
  try {
    // Check / request permission
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }

    if (finalStatus !== 'granted') {
      console.log('Push notification permission denied')
      return null
    }

    // Get Expo push token
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: 'onestop-immigration', // matches app.json slug
    })
    const token = tokenData.data

    // Save token to Supabase
    await supabase.from('push_tokens').upsert(
      {
        user_id: userId,
        token,
        platform: Platform.OS as 'ios' | 'android',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,token' }
    )

    return token
  } catch (error) {
    console.log('Push notification setup error:', error)
    return null
  }
}

/**
 * Remove push token when user logs out
 */
export async function unregisterPushToken(userId: string): Promise<void> {
  try {
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: 'onestop-immigration',
    })
    await supabase
      .from('push_tokens')
      .delete()
      .eq('user_id', userId)
      .eq('token', tokenData.data)
  } catch {
    // Silently fail — not critical
  }
}

/**
 * Set the app badge count
 */
export async function setBadgeCount(count: number): Promise<void> {
  await Notifications.setBadgeCountAsync(count)
}

/**
 * Clear the app badge
 */
export async function clearBadge(): Promise<void> {
  await Notifications.setBadgeCountAsync(0)
}
