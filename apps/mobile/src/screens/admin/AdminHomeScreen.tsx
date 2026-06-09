import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/AuthContext'
import { Colors, Typography, Spacing, Radius } from '../../theme'

interface Stats {
  totalCases: number
  pendingApplications: number
  todayAppointments: number
  openTickets: number
}

export default function AdminHomeScreen({ navigation }: any) {
  const { profile, signOut } = useAuth()
  const [stats, setStats] = useState<Stats>({ totalCases: 0, pendingApplications: 0, todayAppointments: 0, openTickets: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchStats() }, [])

  async function fetchStats() {
    const today = new Date().toISOString().split('T')[0]
    const [cases, apps, appts, tickets] = await Promise.all([
      supabase.from('cases').select('id', { count: 'exact' }).in('status', ['open', 'in_progress']),
      supabase.from('applications').select('id', { count: 'exact' }).eq('status', 'submitted'),
      supabase.from('appointments').select('id', { count: 'exact' }).eq('date', today),
      supabase.from('tickets').select('id', { count: 'exact' }).eq('status', 'open'),
    ])
    setStats({
      totalCases: cases.count ?? 0,
      pendingApplications: apps.count ?? 0,
      todayAppointments: appts.count ?? 0,
      openTickets: tickets.count ?? 0,
    })
    setLoading(false)
  }

  const quickLinks = [
    { label: 'Applications', icon: '📋', screen: 'AdminApplications', badge: stats.pendingApplications },
    { label: 'Cases', icon: '📁', screen: 'AdminCases' },
    { label: 'Appointments', icon: '📅', screen: 'AdminAppointments', badge: stats.todayAppointments },
    { label: 'Availability', icon: '🗓️', screen: 'AdminAvailability' },
  ]

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Admin Portal</Text>
          <Text style={styles.name}>{profile?.full_name ?? 'Attorney'} ⚖️</Text>
        </View>
        <TouchableOpacity onPress={signOut} style={styles.signOutBtn}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {loading ? (
          <ActivityIndicator color={Colors.gold} style={{ marginVertical: Spacing.xl }} />
        ) : (
          <View style={styles.statsGrid}>
            {[
              { label: 'Active Cases', value: stats.totalCases, icon: '📁' },
              { label: 'Pending Apps', value: stats.pendingApplications, icon: '📋' },
              { label: "Today's Appts", value: stats.todayAppointments, icon: '📅' },
              { label: 'Open Tickets', value: stats.openTickets, icon: '🎫' },
            ].map(s => (
              <View key={s.label} style={styles.statCard}>
                <Text style={styles.statIcon}>{s.icon}</Text>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.linksGrid}>
          {quickLinks.map(link => (
            <TouchableOpacity
              key={link.label}
              style={styles.linkCard}
              onPress={() => navigation.navigate(link.screen)}
            >
              <Text style={styles.linkIcon}>{link.icon}</Text>
              <Text style={styles.linkLabel}>{link.label}</Text>
              {link.badge ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{link.badge}</Text>
                </View>
              ) : null}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.navy,
    padding: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: { ...Typography.small, color: Colors.gold },
  name: { ...Typography.h2, color: Colors.white },
  signOutBtn: { backgroundColor: Colors.navyMid, borderRadius: Radius.sm, padding: Spacing.sm },
  signOutText: { ...Typography.small, color: Colors.gold },
  container: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginBottom: Spacing.xl },
  statCard: {
    flex: 1, minWidth: '45%', backgroundColor: Colors.white, borderRadius: Radius.md,
    padding: Spacing.md, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  statIcon: { fontSize: 28, marginBottom: Spacing.xs },
  statValue: { ...Typography.h1, color: Colors.navy },
  statLabel: { ...Typography.small, color: Colors.gray, textAlign: 'center', marginTop: 2 },
  sectionTitle: { ...Typography.h3, color: Colors.navy, marginBottom: Spacing.md },
  linksGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  linkCard: {
    flex: 1, minWidth: '45%', backgroundColor: Colors.navy, borderRadius: Radius.md,
    padding: Spacing.lg, alignItems: 'center', position: 'relative',
  },
  linkIcon: { fontSize: 32, marginBottom: Spacing.sm },
  linkLabel: { ...Typography.body, color: Colors.white },
  badge: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: Colors.danger, borderRadius: Radius.full,
    minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4,
  },
  badgeText: { color: Colors.white, fontSize: 11, fontWeight: '700' },
})
