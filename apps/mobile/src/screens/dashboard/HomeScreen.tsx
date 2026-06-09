import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native'
import { useAuth } from '../../lib/AuthContext'
import { supabase } from '../../lib/supabase'
import { Colors, Typography, Spacing, Radius } from '../../theme'

interface Stats {
  activeCases: number
  upcomingAppointments: number
  openTickets: number
  documents: number
}

export default function HomeScreen({ navigation }: any) {
  const { profile, signOut, user } = useAuth()
  const [stats, setStats] = useState<Stats>({ activeCases: 0, upcomingAppointments: 0, openTickets: 0, documents: 0 })
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetchStats()
    fetchUnreadCount()
  }, [user])

  async function fetchStats() {
    if (!user) return

    const isAdmin = profile?.role === 'admin' || profile?.role === 'lawyer'
    const [cases, appts, tickets, docs] = await Promise.all([
      isAdmin
        ? supabase.from('cases').select('id', { count: 'exact' }).in('status', ['open', 'in_progress'])
        : supabase.from('cases').select('id', { count: 'exact' }).eq('user_id', user.id).in('status', ['open', 'in_progress', 'pending_documents']),
      supabase.from('appointments').select('id', { count: 'exact' }).eq('user_id', user.id).eq('status', 'confirmed').gte('date', new Date().toISOString().split('T')[0]),
      supabase.from('tickets').select('id', { count: 'exact' }).eq('user_id', user.id).eq('status', 'open'),
      supabase.from('documents').select('id', { count: 'exact' }).eq('user_id', user.id),
    ])

    setStats({
      activeCases: cases.count ?? 0,
      upcomingAppointments: appts.count ?? 0,
      openTickets: tickets.count ?? 0,
      documents: docs.count ?? 0,
    })
    setLoading(false)
  }

  async function fetchUnreadCount() {
    if (!user) return
    const { count } = await supabase
      .from('notifications')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id)
      .eq('is_read', false)
    setUnreadCount(count ?? 0)
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.name}>{profile?.full_name ?? 'User'} 👋</Text>
          </View>
          <View style={styles.headerRight}>
            {/* Bell icon */}
            <TouchableOpacity
              style={styles.bellBtn}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Text style={styles.bellIcon}>🔔</Text>
              {unreadCount > 0 && (
                <View style={styles.bellBadge}>
                  <Text style={styles.bellBadgeText}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={signOut} style={styles.signOutBtn}>
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        {loading ? (
          <ActivityIndicator color={Colors.gold} style={{ marginVertical: Spacing.xl }} />
        ) : (
          <View style={styles.statsGrid}>
            {[
              { label: 'Active Cases', value: stats.activeCases, icon: '📁', onPress: () => navigation.navigate('Cases') },
              { label: 'Upcoming Appts', value: stats.upcomingAppointments, icon: '📅', onPress: () => navigation.navigate('Appointments') },
              { label: 'Open Tickets', value: stats.openTickets, icon: '🎫', onPress: () => navigation.navigate('Appointments', { screen: 'Tickets' }) },
              { label: 'Documents', value: stats.documents, icon: '📄', onPress: () => navigation.navigate('Documents') },
            ].map(s => (
              <TouchableOpacity
                key={s.label}
                style={styles.statCard}
                onPress={s.onPress}
              >
                <Text style={styles.statIcon}>{s.icon}</Text>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {[
            { label: 'Apply for Visa', icon: '📝', onPress: () => navigation.navigate('Apply') },
            { label: 'Book Appointment', icon: '📅', onPress: () => navigation.navigate('Appointments', { screen: 'BookAppointment' }) },
            { label: 'Upload Document', icon: '📤', onPress: () => navigation.navigate('Documents') },
            { label: 'Support Ticket', icon: '🎫', onPress: () => navigation.navigate('Appointments', { screen: 'Tickets' }) },
          ].map(a => (
            <TouchableOpacity key={a.label} style={styles.actionCard} onPress={a.onPress}>
              <Text style={styles.actionIcon}>{a.icon}</Text>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Role badge */}
        {profile?.role && (
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>
              {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)} Portal
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  container: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
    backgroundColor: Colors.navy,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  greeting: { ...Typography.body, color: Colors.gray },
  name: { ...Typography.h2, color: Colors.white },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  bellBtn: { position: 'relative', padding: Spacing.xs },
  bellIcon: { fontSize: 24 },
  bellBadge: {
    position: 'absolute', top: 0, right: 0,
    backgroundColor: Colors.danger,
    borderRadius: Radius.full,
    minWidth: 18, height: 18,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 3,
  },
  bellBadgeText: { color: Colors.white, fontSize: 10, fontWeight: '700' },
  signOutBtn: { backgroundColor: Colors.navyMid, borderRadius: Radius.sm, padding: Spacing.sm },
  signOutText: { ...Typography.small, color: Colors.gold },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginBottom: Spacing.xl },
  statCard: {
    flex: 1, minWidth: '45%', backgroundColor: Colors.white,
    borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  statIcon: { fontSize: 28, marginBottom: Spacing.xs },
  statValue: { ...Typography.h1, color: Colors.navy },
  statLabel: { ...Typography.small, color: Colors.gray, textAlign: 'center', marginTop: 2 },
  sectionTitle: { ...Typography.h3, color: Colors.navy, marginBottom: Spacing.md },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginBottom: Spacing.xl },
  actionCard: {
    flex: 1, minWidth: '45%', backgroundColor: Colors.navy,
    borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center', gap: Spacing.xs,
  },
  actionIcon: { fontSize: 28 },
  actionLabel: { ...Typography.small, color: Colors.white, textAlign: 'center' },
  roleBadge: {
    alignSelf: 'center', backgroundColor: Colors.gold + '22',
    borderRadius: Radius.full, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
    borderWidth: 1, borderColor: Colors.gold,
  },
  roleBadgeText: { ...Typography.label, color: Colors.goldDark },
})
