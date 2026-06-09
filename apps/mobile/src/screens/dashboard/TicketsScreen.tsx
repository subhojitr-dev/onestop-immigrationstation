import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../lib/supabase'
import { Colors, Typography, Spacing, Radius } from '../../theme'

interface Ticket {
  id: string
  subject: string
  status: string
  created_at: string
  updated_at: string
}

export default function TicketsScreen({ navigation }: any) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTickets()
  }, [])

  async function fetchTickets() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('tickets')
      .select('id, subject, status, created_at, updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
    setTickets(data ?? [])
    setLoading(false)
  }

  const STATUS_COLORS: Record<string, string> = {
    open: Colors.success,
    in_progress: Colors.info,
    closed: Colors.gray,
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Support Tickets</Text>
        <TouchableOpacity style={styles.newBtn} onPress={() => navigation.navigate('NewTicket', { onCreated: fetchTickets })}>
          <Text style={styles.newBtnText}>+ New</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator color={Colors.gold} style={{ marginTop: Spacing.xl }} />
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🎫</Text>
              <Text style={styles.emptyText}>No tickets yet</Text>
            </View>
          }
          renderItem={({ item }) => {
            const statusColor = STATUS_COLORS[item.status] ?? Colors.gray
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('TicketDetail', { ticketId: item.id })}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.subject} numberOfLines={1}>{item.subject}</Text>
                  <View style={[styles.badge, { backgroundColor: statusColor + '22', borderColor: statusColor }]}>
                    <Text style={[styles.badgeText, { color: statusColor }]}>{item.status.toUpperCase()}</Text>
                  </View>
                </View>
                <Text style={styles.date}>Last updated: {new Date(item.updated_at).toLocaleDateString()}</Text>
              </TouchableOpacity>
            )
          }}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.navy, padding: Spacing.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { ...Typography.h2, color: Colors.white },
  newBtn: { backgroundColor: Colors.gold, borderRadius: Radius.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs },
  newBtnText: { ...Typography.label, color: Colors.navy },
  list: { padding: Spacing.lg, gap: Spacing.md },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs },
  subject: { ...Typography.body, color: Colors.navy, fontWeight: '600', flex: 1, marginRight: Spacing.sm },
  badge: { borderRadius: Radius.full, paddingHorizontal: Spacing.sm, paddingVertical: 2, borderWidth: 1 },
  badgeText: { ...Typography.label, fontSize: 10 },
  date: { ...Typography.small, color: Colors.gray },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: Spacing.xxl },
  emptyIcon: { fontSize: 64, marginBottom: Spacing.md },
  emptyText: { ...Typography.h3, color: Colors.navy },
})
