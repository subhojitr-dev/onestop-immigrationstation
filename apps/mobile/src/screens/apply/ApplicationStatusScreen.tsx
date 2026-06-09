import React, { useEffect, useState } from 'react'
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/AuthContext'
import { Colors, Typography, Spacing, Radius } from '../../theme'

interface Application {
  id: string
  visa_type: string
  status: string
  created_at: string
  updated_at: string
  lawyer_notes?: string
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
  h1b: 'H-1B Specialty Occupation',
  l1: 'L-1 Intracompany Transfer',
  green_card: 'Green Card',
  k1: 'K-1 Fiancé(e) Visa',
  family_petition: 'Family Petition',
}

export default function ApplicationStatusScreen({ navigation }: any) {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApplications()
  }, [user])

  async function fetchApplications() {
    if (!user) return
    const { data } = await supabase
      .from('applications')
      .select('id, visa_type, status, created_at, updated_at, lawyer_notes')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
    setApplications(data ?? [])
    setLoading(false)
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Applications</Text>
        <View style={{ width: 60 }} />
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
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyText}>No applications yet</Text>
              <TouchableOpacity style={styles.applyBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.applyBtnText}>Start an Application</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => {
            const statusColor = STATUS_COLORS[item.status] ?? Colors.gray
            const isDraft = item.status === 'draft'
            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.visaLabel}>
                    {VISA_LABELS[item.visa_type] ?? item.visa_type}
                  </Text>
                  <View style={[styles.badge, { backgroundColor: statusColor + '22', borderColor: statusColor }]}>
                    <Text style={[styles.badgeText, { color: statusColor }]}>
                      {item.status.replace(/_/g, ' ').toUpperCase()}
                    </Text>
                  </View>
                </View>

                <Text style={styles.dateText}>
                  {isDraft ? 'Last saved' : 'Submitted'}: {new Date(item.updated_at).toLocaleDateString()}
                </Text>

                {item.lawyer_notes && (
                  <View style={styles.notesBox}>
                    <Text style={styles.notesLabel}>Attorney Notes:</Text>
                    <Text style={styles.notesText}>{item.lawyer_notes}</Text>
                  </View>
                )}

                {isDraft && (
                  <TouchableOpacity
                    style={styles.resumeBtn}
                    onPress={() => navigation.navigate('Questionnaire', { visaType: item.visa_type })}
                  >
                    <Text style={styles.resumeBtnText}>Resume Application →</Text>
                  </TouchableOpacity>
                )}
              </View>
            )
          }}
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
    gap: Spacing.sm,
  },
  visaLabel: { ...Typography.body, color: Colors.navy, fontWeight: '600', flex: 1 },
  badge: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
    flexShrink: 0,
  },
  badgeText: { fontSize: 9, fontWeight: '700' },
  dateText: { ...Typography.small, color: Colors.gray, marginBottom: Spacing.sm },
  notesBox: {
    backgroundColor: Colors.offWhite,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.gold,
  },
  notesLabel: { ...Typography.label, color: Colors.darkGray, marginBottom: 2 },
  notesText: { ...Typography.small, color: Colors.darkGray },
  resumeBtn: {
    backgroundColor: Colors.gold,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  resumeBtnText: { ...Typography.label, color: Colors.navy },
  empty: { flex: 1, alignItems: 'center', paddingTop: Spacing.xxl },
  emptyIcon: { fontSize: 64, marginBottom: Spacing.md },
  emptyText: { ...Typography.h3, color: Colors.navy, marginBottom: Spacing.lg },
  applyBtn: {
    backgroundColor: Colors.gold,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  applyBtnText: { ...Typography.body, color: Colors.navy, fontWeight: '600' },
})
