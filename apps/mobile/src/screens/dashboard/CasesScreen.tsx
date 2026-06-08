import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../lib/supabase'
import { Colors, Typography, Spacing, Radius } from '../../theme'

interface Case {
  id: string
  case_number: string
  visa_type: string
  status: string
  opened_date: string
  assigned_attorney?: string
}

const STATUS_COLORS: Record<string, string> = {
  open: Colors.success,
  in_progress: Colors.info,
  pending_documents: Colors.warning,
  submitted: Colors.info,
  approved: Colors.success,
  denied: Colors.danger,
  closed: Colors.gray,
}

export default function CasesScreen({ navigation }: any) {
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCases()
  }, [])

  async function fetchCases() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('cases')
      .select('id, case_number, visa_type, status, opened_date, assigned_attorney')
      .eq('user_id', user.id)
      .order('opened_date', { ascending: false })

    setCases(data ?? [])
    setLoading(false)
  }

  function renderCase({ item }: { item: Case }) {
    const statusColor = STATUS_COLORS[item.status] ?? Colors.gray
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('CaseDetail', { caseId: item.id })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.caseNumber}>{item.case_number}</Text>
          <View style={[styles.badge, { backgroundColor: statusColor + '22', borderColor: statusColor }]}>
            <Text style={[styles.badgeText, { color: statusColor }]}>
              {item.status.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
        </View>
        <Text style={styles.visaType}>{item.visa_type}</Text>
        {item.assigned_attorney && (
          <Text style={styles.attorney}>Attorney: {item.assigned_attorney}</Text>
        )}
        <Text style={styles.date}>Opened: {new Date(item.opened_date).toLocaleDateString()}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>My Cases</Text>
      </View>
      {loading ? (
        <ActivityIndicator color={Colors.gold} style={{ marginTop: Spacing.xl }} />
      ) : cases.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📁</Text>
          <Text style={styles.emptyText}>No cases yet</Text>
          <Text style={styles.emptySubtext}>Your immigration cases will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={cases}
          keyExtractor={item => item.id}
          renderItem={renderCase}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.navy, padding: Spacing.lg, paddingTop: Spacing.md },
  title: { ...Typography.h2, color: Colors.white },
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
  caseNumber: { ...Typography.h3, color: Colors.navy },
  badge: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
  },
  badgeText: { ...Typography.label, fontSize: 10 },
  visaType: { ...Typography.body, color: Colors.darkGray, marginBottom: Spacing.xs },
  attorney: { ...Typography.small, color: Colors.gray, marginBottom: 2 },
  date: { ...Typography.small, color: Colors.gray },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyIcon: { fontSize: 64, marginBottom: Spacing.md },
  emptyText: { ...Typography.h3, color: Colors.navy, marginBottom: Spacing.xs },
  emptySubtext: { ...Typography.body, color: Colors.gray },
})
