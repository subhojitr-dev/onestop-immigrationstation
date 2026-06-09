import React, { useEffect, useState } from 'react'
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/AuthContext'
import { clearBadge } from '../../lib/notifications'
import { Colors, Typography, Spacing, Radius } from '../../theme'

interface Notification {
  id: string
  title: string
  body: string
  type: string
  data: Record<string, string>
  is_read: boolean
  created_at: string
}

const TYPE_ICONS: Record<string, string> = {
  case_update: '📁',
  appointment: '📅',
  ticket_reply: '🎫',
  case_opened: '⚖️',
  general: '🔔',
}

export default function NotificationsScreen({ navigation }: any) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
    clearBadge()
  }, [user])

  async function fetchNotifications() {
    if (!user) return
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)
    setNotifications(data ?? [])
    setLoading(false)
  }

  async function markAsRead(id: string) {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    )
  }

  async function markAllRead() {
    if (!user) return
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false)
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
  }

  function handleTap(notification: Notification) {
    if (!notification.is_read) markAsRead(notification.id)

    // Navigate to relevant screen based on type
    const data = notification.data ?? {}
    switch (notification.type) {
      case 'case_update':
      case 'case_opened':
        if (data.caseId) navigation.navigate('Cases', { screen: 'CaseDetail', params: { caseId: data.caseId } })
        break
      case 'appointment':
        navigation.navigate('Appointments')
        break
      case 'ticket_reply':
        if (data.ticketId) navigation.navigate('Appointments', { screen: 'TicketDetail', params: { ticketId: data.ticketId } })
        break
      default:
        break
    }
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
        {unreadCount === 0 && <View style={{ width: 80 }} />}
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.gold} style={{ marginTop: Spacing.xl }} />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🔔</Text>
              <Text style={styles.emptyText}>No notifications yet</Text>
              <Text style={styles.emptySubtext}>You'll be notified about case updates, appointments, and messages</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, !item.is_read && styles.cardUnread]}
              onPress={() => handleTap(item)}
            >
              <View style={styles.cardLeft}>
                <Text style={styles.typeIcon}>{TYPE_ICONS[item.type] ?? '🔔'}</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={[styles.cardTitle, !item.is_read && styles.cardTitleUnread]}>
                  {item.title}
                </Text>
                <Text style={styles.cardBody2} numberOfLines={2}>{item.body}</Text>
                <Text style={styles.cardTime}>
                  {new Date(item.created_at).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </Text>
              </View>
              {!item.is_read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.navy,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backText: { color: Colors.gold, ...Typography.body },
  title: { ...Typography.h3, color: Colors.white },
  markAllText: { ...Typography.small, color: Colors.gold },
  list: { padding: Spacing.lg, gap: Spacing.sm },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardUnread: {
    backgroundColor: Colors.navy + '0a',
    borderLeftWidth: 3,
    borderLeftColor: Colors.gold,
  },
  cardLeft: { paddingTop: 2 },
  typeIcon: { fontSize: 24 },
  cardBody: { flex: 1 },
  cardTitle: { ...Typography.body, color: Colors.darkGray, marginBottom: 2 },
  cardTitleUnread: { color: Colors.navy, fontWeight: '700' },
  cardBody2: { ...Typography.small, color: Colors.gray, lineHeight: 18, marginBottom: 4 },
  cardTime: { ...Typography.small, color: Colors.gray, fontSize: 11 },
  unreadDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.gold, marginTop: 6,
  },
  empty: { alignItems: 'center', paddingTop: Spacing.xxl, paddingHorizontal: Spacing.xl },
  emptyIcon: { fontSize: 64, marginBottom: Spacing.md },
  emptyText: { ...Typography.h3, color: Colors.navy, marginBottom: Spacing.xs },
  emptySubtext: { ...Typography.body, color: Colors.gray, textAlign: 'center', lineHeight: 22 },
})
