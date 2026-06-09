import React, { useEffect, useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/AuthContext'
import { Colors, Typography, Spacing, Radius } from '../../theme'

const VISA_TYPES = [
  {
    key: 'h1b',
    label: 'H-1B',
    title: 'H-1B Specialty Occupation',
    description: 'For professionals in specialty occupations sponsored by a US employer',
    icon: '💼',
    color: '#2563eb',
  },
  {
    key: 'l1',
    label: 'L-1',
    title: 'L-1 Intracompany Transfer',
    description: 'For employees transferring within a multinational company',
    icon: '🏢',
    color: '#7c3aed',
  },
  {
    key: 'green_card',
    label: 'Green Card',
    title: 'Green Card (Permanent Residence)',
    description: 'For individuals seeking permanent residence in the United States',
    icon: '🟢',
    color: '#059669',
  },
  {
    key: 'k1',
    label: 'K-1',
    title: 'K-1 Fiancé(e) Visa',
    description: 'For the foreign-citizen fiancé(e) of a US citizen',
    icon: '💍',
    color: '#db2777',
  },
  {
    key: 'family_petition',
    label: 'Family Petition',
    title: 'Family Petition',
    description: 'For US citizens and permanent residents petitioning for family members',
    icon: '👨‍👩‍👧',
    color: '#d97706',
  },
]

interface ExistingApp {
  id: string
  visa_type: string
  status: string
  updated_at: string
}

export default function VisaSelectionScreen({ navigation }: any) {
  const { user } = useAuth()
  const [existingApps, setExistingApps] = useState<ExistingApp[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExistingApps()
  }, [user])

  async function fetchExistingApps() {
    if (!user) return
    const { data } = await supabase
      .from('applications')
      .select('id, visa_type, status, updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
    setExistingApps(data ?? [])
    setLoading(false)
  }

  function getAppForVisaType(visaKey: string) {
    return existingApps.find(a => a.visa_type === visaKey)
  }

  function handleSelectVisa(visaKey: string) {
    navigation.navigate('Questionnaire', { visaType: visaKey })
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Home</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Apply for a Visa</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ApplicationStatus')}>
          <Text style={styles.statusLink}>My Applications</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.gold} style={{ marginTop: Spacing.xl }} />
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.subtitle}>Select the visa type you want to apply for</Text>

          {VISA_TYPES.map(visa => {
            const existing = getAppForVisaType(visa.key)
            const isDraft = existing?.status === 'draft'
            const isSubmitted = existing && existing.status !== 'draft'

            return (
              <TouchableOpacity
                key={visa.key}
                style={[styles.card, isSubmitted && styles.cardSubmitted]}
                onPress={() => !isSubmitted && handleSelectVisa(visa.key)}
                disabled={isSubmitted}
              >
                <View style={[styles.iconBox, { backgroundColor: visa.color + '22' }]}>
                  <Text style={styles.icon}>{visa.icon}</Text>
                </View>
                <View style={styles.cardContent}>
                  <View style={styles.cardTitleRow}>
                    <Text style={styles.cardLabel}>{visa.label}</Text>
                    {isDraft && (
                      <View style={styles.draftBadge}>
                        <Text style={styles.draftText}>IN PROGRESS</Text>
                      </View>
                    )}
                    {isSubmitted && (
                      <View style={styles.submittedBadge}>
                        <Text style={styles.submittedText}>{existing!.status.toUpperCase()}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.cardTitle}>{visa.title}</Text>
                  <Text style={styles.cardDesc}>{visa.description}</Text>
                  {isDraft && (
                    <Text style={styles.resumeText}>Tap to resume →</Text>
                  )}
                  {isSubmitted && (
                    <Text style={styles.submittedNote}>Already submitted</Text>
                  )}
                </View>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
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
  statusLink: { color: Colors.gold, ...Typography.small },
  container: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  subtitle: { ...Typography.body, color: Colors.gray, marginBottom: Spacing.lg },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    gap: Spacing.md,
  },
  cardSubmitted: { opacity: 0.6 },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  icon: { fontSize: 28 },
  cardContent: { flex: 1 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: 2 },
  cardLabel: { ...Typography.h3, color: Colors.navy },
  draftBadge: {
    backgroundColor: Colors.warning + '33',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.warning,
  },
  draftText: { fontSize: 9, color: Colors.warning, fontWeight: '700' },
  submittedBadge: {
    backgroundColor: Colors.success + '22',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  submittedText: { fontSize: 9, color: Colors.success, fontWeight: '700' },
  cardTitle: { ...Typography.small, color: Colors.darkGray, fontWeight: '600', marginBottom: 2 },
  cardDesc: { ...Typography.small, color: Colors.gray, lineHeight: 18 },
  resumeText: { ...Typography.small, color: Colors.gold, marginTop: Spacing.xs, fontWeight: '600' },
  submittedNote: { ...Typography.small, color: Colors.gray, marginTop: Spacing.xs, fontStyle: 'italic' },
})
