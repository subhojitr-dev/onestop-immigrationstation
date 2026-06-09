import React, { useEffect, useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/AuthContext'
import { Colors, Typography, Spacing, Radius } from '../../theme'

const STATUSES = ['submitted', 'under_review', 'info_requested', 'approved', 'rejected']

const VISA_LABELS: Record<string, string> = {
  h1b: 'H-1B', l1: 'L-1', green_card: 'Green Card', k1: 'K-1', family_petition: 'Family Petition',
}

export default function AdminApplicationDetailScreen({ route, navigation }: any) {
  const { appId } = route.params
  const { profile } = useAuth()
  const [app, setApp] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [openingCase, setOpeningCase] = useState(false)

  useEffect(() => { fetchApp() }, [appId])

  async function fetchApp() {
    const { data } = await supabase
      .from('applications')
      .select('*, profiles(full_name, email)')
      .eq('id', appId)
      .single()
    setApp(data)
    setStatus(data?.status ?? '')
    setNotes(data?.lawyer_notes ?? '')
    setLoading(false)
  }

  async function handleSave() {
    setSaving(true)
    const { error } = await supabase
      .from('applications')
      .update({ status, lawyer_notes: notes })
      .eq('id', appId)
    setSaving(false)
    if (error) {
      Alert.alert('Error', 'Could not save. Run migration 009 in Supabase SQL Editor first.')
    } else {
      Alert.alert('Saved', 'Application updated successfully.')
    }
  }

  async function handleOpenCase() {
    if (app?.case_id) {
      Alert.alert('Already Opened', `A case already exists for this application.`)
      return
    }

    Alert.alert(
      'Open Case',
      `Open a case for ${(app?.profiles as any)?.full_name ?? 'this client'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open Case',
          onPress: async () => {
            setOpeningCase(true)

            // Generate case number OSIS-YYYY-NNN
            const year = new Date().getFullYear()
            const { count } = await supabase
              .from('cases')
              .select('*', { count: 'exact', head: true })
            const caseNum = `OSIS-${year}-${String((count ?? 0) + 1).padStart(3, '0')}`

            const visaLabel = VISA_LABELS[app.visa_type] ?? app.visa_type
            const clientName = (app?.profiles as any)?.full_name ?? 'Client'

            // Create the case
            const { data: newCase, error: caseError } = await supabase
              .from('cases')
              .insert({
                case_number: caseNum,
                user_id: app.user_id,
                visa_type: visaLabel,
                status: 'open',
                description: `${visaLabel} case opened from intake application.${notes ? ' Attorney notes: ' + notes : ''}`.trim(),
                assigned_attorney: profile?.full_name ?? null,
                opened_date: new Date().toISOString(),
              })
              .select('id')
              .single()

            if (caseError || !newCase) {
              setOpeningCase(false)
              Alert.alert('Error', caseError?.message ?? 'Failed to create case. Run migration 011 first.')
              return
            }

            // Add timeline event
            await supabase.from('case_timeline').insert({
              case_id: newCase.id,
              event: 'Case Opened',
              description: `${visaLabel} case opened for ${clientName}. Reviewed by ${profile?.full_name ?? 'attorney'}.`,
            })

            // Update application
            await supabase
              .from('applications')
              .update({ status: 'case_opened', case_id: newCase.id })
              .eq('id', appId)

            // Send push notification to client
            const apiUrl = process.env.EXPO_PUBLIC_API_URL
            fetch(`${apiUrl}/api/email`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'case_status',
                clientUserId: app.user_id,
                caseId: newCase.id,
                event: `Case ${caseNum} opened for your ${visaLabel} application.`,
              }),
            }).catch(() => {})

            setOpeningCase(false)
            await fetchApp()
            Alert.alert(
              '✅ Case Opened',
              `Case ${caseNum} has been created successfully.`,
              [{ text: 'OK' }]
            )
          },
        },
      ]
    )
  }

  if (loading) return (
    <SafeAreaView style={styles.safe}>
      <ActivityIndicator color={Colors.gold} style={{ marginTop: Spacing.xl }} />
    </SafeAreaView>
  )

  const answers = app?.data ?? {}
  const answerEntries = Object.entries(answers).filter(([k]) => !k.startsWith('__'))
  const caseAlreadyOpened = !!app?.case_id || app?.status === 'case_opened'

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Applications</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Review Application</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Client info */}
        <View style={styles.infoCard}>
          <Text style={styles.clientName}>{(app?.profiles as any)?.full_name ?? 'Unknown'}</Text>
          <Text style={styles.visaType}>{VISA_LABELS[app?.visa_type] ?? app?.visa_type}</Text>
          <Text style={styles.date}>Submitted: {new Date(app?.updated_at).toLocaleDateString()}</Text>
          {caseAlreadyOpened && app?.case_id && (
            <View style={styles.caseOpenedBadge}>
              <Text style={styles.caseOpenedText}>✅ Case Already Opened</Text>
            </View>
          )}
        </View>

        {/* Open Case button */}
        {!caseAlreadyOpened && (
          <TouchableOpacity
            style={styles.openCaseBtn}
            onPress={handleOpenCase}
            disabled={openingCase}
          >
            {openingCase
              ? <ActivityIndicator color={Colors.white} />
              : <Text style={styles.openCaseBtnText}>⚖️ Open Case</Text>
            }
          </TouchableOpacity>
        )}

        {/* Status update */}
        <Text style={styles.sectionTitle}>Update Status</Text>
        <View style={styles.statusGrid}>
          {STATUSES.map(s => (
            <TouchableOpacity
              key={s}
              style={[styles.statusChip, status === s && styles.statusChipActive]}
              onPress={() => setStatus(s)}
            >
              <Text style={[styles.statusChipText, status === s && styles.statusChipTextActive]}>
                {s.replace(/_/g, ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notes */}
        <Text style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>Attorney Notes</Text>
        <TextInput
          style={styles.notesInput}
          value={notes}
          onChangeText={setNotes}
          placeholder="Add notes for the client..."
          placeholderTextColor={Colors.gray}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
          {saving ? <ActivityIndicator color={Colors.navy} /> : <Text style={styles.saveBtnText}>Save Changes</Text>}
        </TouchableOpacity>

        {/* Answers */}
        {answerEntries.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>Application Answers</Text>
            {answerEntries.map(([key, value]) => (
              <View key={key} style={styles.answerRow}>
                <Text style={styles.answerKey}>{key.replace(/_/g, ' ')}</Text>
                <Text style={styles.answerValue}>{String(value)}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  topBar: { backgroundColor: Colors.navy, padding: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  backText: { color: Colors.gold, ...Typography.body },
  topTitle: { ...Typography.h3, color: Colors.white },
  container: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  infoCard: { backgroundColor: Colors.white, borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.md, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  clientName: { ...Typography.h3, color: Colors.navy },
  visaType: { ...Typography.body, color: Colors.gray, marginTop: 2 },
  date: { ...Typography.small, color: Colors.gray, marginTop: 2 },
  caseOpenedBadge: { marginTop: Spacing.sm, backgroundColor: Colors.success + '22', borderRadius: Radius.sm, padding: Spacing.xs, alignSelf: 'flex-start' },
  caseOpenedText: { ...Typography.small, color: Colors.success, fontWeight: '600' },
  openCaseBtn: { backgroundColor: Colors.navy, borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center', marginBottom: Spacing.lg, borderWidth: 2, borderColor: Colors.gold },
  openCaseBtnText: { ...Typography.h3, color: Colors.gold },
  sectionTitle: { ...Typography.h3, color: Colors.navy, marginBottom: Spacing.md },
  statusGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
  statusChip: { borderRadius: Radius.full, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderWidth: 1, borderColor: Colors.lightGray, backgroundColor: Colors.white },
  statusChipActive: { backgroundColor: Colors.navy, borderColor: Colors.navy },
  statusChipText: { ...Typography.small, color: Colors.gray, textTransform: 'capitalize' },
  statusChipTextActive: { color: Colors.gold },
  notesInput: { borderWidth: 1, borderColor: Colors.lightGray, borderRadius: Radius.sm, padding: Spacing.md, fontSize: 15, color: Colors.darkGray, backgroundColor: Colors.white, minHeight: 100, marginBottom: Spacing.lg },
  saveBtn: { backgroundColor: Colors.gold, borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center' },
  saveBtnText: { ...Typography.h3, color: Colors.navy },
  answerRow: { backgroundColor: Colors.white, borderRadius: Radius.sm, padding: Spacing.sm, marginBottom: Spacing.sm },
  answerKey: { ...Typography.label, color: Colors.gray, textTransform: 'capitalize' },
  answerValue: { ...Typography.body, color: Colors.darkGray, marginTop: 2 },
})
