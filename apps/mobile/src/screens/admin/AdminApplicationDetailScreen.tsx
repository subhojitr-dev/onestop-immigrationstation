import React, { useEffect, useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native'
import { supabase } from '../../lib/supabase'
import { Colors, Typography, Spacing, Radius } from '../../theme'

const STATUSES = ['submitted', 'under_review', 'info_requested', 'approved', 'rejected']

const VISA_LABELS: Record<string, string> = {
  h1b: 'H-1B', l1: 'L-1', green_card: 'Green Card', k1: 'K-1', family_petition: 'Family Petition',
}

export default function AdminApplicationDetailScreen({ route, navigation }: any) {
  const { appId } = route.params
  const [app, setApp] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

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
      navigation.goBack()
    }
  }

  if (loading) return (
    <SafeAreaView style={styles.safe}>
      <ActivityIndicator color={Colors.gold} style={{ marginTop: Spacing.xl }} />
    </SafeAreaView>
  )

  const answers = app?.data ?? {}
  const answerEntries = Object.entries(answers).filter(([k]) => !k.startsWith('__'))

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
        </View>

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
  infoCard: { backgroundColor: Colors.white, borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.lg, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  clientName: { ...Typography.h3, color: Colors.navy },
  visaType: { ...Typography.body, color: Colors.gray, marginTop: 2 },
  date: { ...Typography.small, color: Colors.gray, marginTop: 2 },
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
