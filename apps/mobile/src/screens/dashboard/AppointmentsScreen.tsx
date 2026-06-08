import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Linking } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../lib/supabase'
import { Colors, Typography, Spacing, Radius } from '../../theme'

interface Appointment {
  id: string
  date: string
  time_slot: string
  status: string
  lawyer_name?: string
  location?: string
  meeting_link?: string
  notes?: string
}

const STATUS_COLORS: Record<string, string> = {
  pending: Colors.warning,
  confirmed: Colors.success,
  cancelled: Colors.danger,
  completed: Colors.gray,
}

export default function AppointmentsScreen({ navigation }: any) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAppointments()
  }, [])

  async function fetchAppointments() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: true })
    setAppointments(data ?? [])
    setLoading(false)
  }

  const today = new Date().toISOString().split('T')[0]
  const upcoming = appointments.filter(a => a.date >= today && a.status !== 'cancelled')
  const past = appointments.filter(a => a.date < today || a.status === 'cancelled')

  function renderAppointment({ item }: { item: Appointment }) {
    const statusColor = STATUS_COLORS[item.status] ?? Colors.gray
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.dateText}>{new Date(item.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</Text>
            <Text style={styles.timeText}>{item.time_slot}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: statusColor + '22', borderColor: statusColor }]}>
            <Text style={[styles.badgeText, { color: statusColor }]}>{item.status.toUpperCase()}</Text>
          </View>
        </View>
        {item.lawyer_name && <Text style={styles.lawyerText}>With: {item.lawyer_name}</Text>}
        {item.location && <Text style={styles.detailText}>📍 {item.location}</Text>}
        {item.meeting_link && item.status === 'confirmed' && (
          <TouchableOpacity onPress={() => Linking.openURL(item.meeting_link!)}>
            <Text style={styles.joinLink}>🎥 Join Meeting →</Text>
          </TouchableOpacity>
        )}
        {item.notes && <Text style={styles.notes}>{item.notes}</Text>}
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Appointments</Text>
        <TouchableOpacity style={styles.bookBtn} onPress={() => navigation.navigate('BookAppointment')}>
          <Text style={styles.bookBtnText}>+ Book</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator color={Colors.gold} style={{ marginTop: Spacing.xl }} />
      ) : (
        <FlatList
          data={[...upcoming, ...past]}
          keyExtractor={item => item.id}
          renderItem={renderAppointment}
          contentContainerStyle={styles.list}
          ListHeaderComponent={upcoming.length > 0 ? <Text style={styles.sectionLabel}>Upcoming</Text> : null}
          ListFooterComponent={past.length > 0 ? (
            <View>
              <Text style={[styles.sectionLabel, { marginTop: Spacing.lg }]}>Past</Text>
            </View>
          ) : null}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>📅</Text>
              <Text style={styles.emptyText}>No appointments yet</Text>
              <TouchableOpacity style={styles.bookBtnLarge} onPress={() => navigation.navigate('BookAppointment')}>
                <Text style={styles.bookBtnText}>Book an Appointment</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.navy, padding: Spacing.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { ...Typography.h2, color: Colors.white },
  bookBtn: { backgroundColor: Colors.gold, borderRadius: Radius.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs },
  bookBtnText: { ...Typography.label, color: Colors.navy },
  list: { padding: Spacing.lg, gap: Spacing.md },
  sectionLabel: { ...Typography.h3, color: Colors.navy, marginBottom: Spacing.sm },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.xs },
  dateText: { ...Typography.body, color: Colors.navy, fontWeight: '600' },
  timeText: { ...Typography.small, color: Colors.gray },
  badge: { borderRadius: Radius.full, paddingHorizontal: Spacing.sm, paddingVertical: 2, borderWidth: 1 },
  badgeText: { ...Typography.label, fontSize: 10 },
  lawyerText: { ...Typography.small, color: Colors.gray, marginBottom: 2 },
  detailText: { ...Typography.small, color: Colors.gray, marginBottom: 2 },
  joinLink: { ...Typography.body, color: Colors.gold, fontWeight: '600', marginTop: Spacing.xs },
  notes: { ...Typography.small, color: Colors.gray, marginTop: Spacing.xs, fontStyle: 'italic' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: Spacing.xxl },
  emptyIcon: { fontSize: 64, marginBottom: Spacing.md },
  emptyText: { ...Typography.h3, color: Colors.navy, marginBottom: Spacing.lg },
  bookBtnLarge: { backgroundColor: Colors.gold, borderRadius: Radius.md, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
})
