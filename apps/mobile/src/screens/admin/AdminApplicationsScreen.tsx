import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native'
import { supabase } from '../../lib/supabase'
import { Colors, Typography, Spacing, Radius } from '../../theme'

interface Application {
  id: string
  visa_type: string
  status: string
  created_at: string
  updated_at: string
  profiles?: Array<{ full_name: string; email?: string }>
}

const STATUS_COLORS: Record<string, string> = {
  draft: Colors.gray,
  submitted: Colors.info,
  under_review: Colors.warning,
  info_requested: Colors.danger,
  approved: Colors.success,
  rejected: Colors.danger,
  case_opened: Colors.success,
}

const VISA_LABELS: Record<string, string> = {
  h1b: 'H-1B', l1: 'L-1', green_card: 'Green Card', k1: 'K-1', family_petition: 'Family Petition',
}

export default function AdminApplicationsScreen({ navigation }: any) {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('submitted')

  useEffect(() => { fetchApplications() }, [filter])

  async function fetchApplications() {
    setLoading(true)
    let query = supabase
      .from('applications')
      .select('id, visa_type, status, created_at, updated_at, profiles(full_name)')
      .order('updated_at', { ascending: false })

    if (filter !== 'all') query = query.eq('status', filter)

    const { data } = await query
    setApplications((data as Application[]) ?? [])
    setLoading(false)
  }

  const filters = ['submitted', 'under_review', 'info_requested', 'all']

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Admin</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Applications</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.filterRow}>
        {filters.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'all' ? 'All' : f.replace('_', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.gold} style={{ marginTop: Spacing.xl }} />
      ) : (
        <FlatList
          data={applications}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No applications found</Text>
            </View>
          }
          renderItem={({ item }) => {
            const statusColor = STATUS_COLORS[item.status] ?? Colors.gray
            const clientName = (item.profiles as any)?.full_name ?? 'Unknown Client'
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('AdminApplicationDetail', { appId: item.id })}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.clientName}>{clientName}</Text>
                  <View style={[styles.badge, { backgroundColor: statusColor + '22', borderColor: statusColor }]}>
                    <Text style={[styles.badgeText, { color: statusColor }]}>
                      {item.status.replace(/_/g, ' ').toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={styles.visaType}>{VISA_LABELS[item.visa_type] ?? item.visa_type}</Text>
                <Text style={styles.date}>Updated: {new Date(item.updated_at).toLocaleDateString()}</Text>
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
  header: { backgroundColor: Colors.navy, padding: Spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backText: { color: Colors.gold, ...Typography.body },
  title: { ...Typography.h3, color: Colors.white },
  filterRow: { flexDirection: 'row', padding: Spacing.md, gap: Spacing.sm, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.lightGray },
  filterChip: { borderRadius: Radius.full, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderWidth: 1, borderColor: Colors.lightGray },
  filterChipActive: { backgroundColor: Colors.navy, borderColor: Colors.navy },
  filterText: { ...Typography.small, color: Colors.gray, textTransform: 'capitalize' },
  filterTextActive: { color: Colors.white },
  list: { padding: Spacing.lg, gap: Spacing.md },
  card: { backgroundColor: Colors.white, borderRadius: Radius.md, padding: Spacing.md, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs },
  clientName: { ...Typography.body, color: Colors.navy, fontWeight: '600', flex: 1, marginRight: Spacing.sm },
  badge: { borderRadius: Radius.full, paddingHorizontal: Spacing.sm, paddingVertical: 2, borderWidth: 1 },
  badgeText: { fontSize: 9, fontWeight: '700' },
  visaType: { ...Typography.small, color: Colors.gray },
  date: { ...Typography.small, color: Colors.gray, marginTop: 2 },
  empty: { alignItems: 'center', paddingTop: Spacing.xxl },
  emptyText: { ...Typography.body, color: Colors.gray },
})
