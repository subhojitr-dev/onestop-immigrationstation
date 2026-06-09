import React, { useEffect, useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, TextInput, Alert, Modal,
} from 'react-native'
import { SafeAreaView } from 'react-native'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/AuthContext'
import { Colors, Typography, Spacing, Radius } from '../../theme'

interface CaseData {
  id: string
  case_number: string
  visa_type: string
  status: string
  description?: string
  assigned_attorney?: string
  opened_date: string
}

interface TimelineEvent {
  id: string
  event: string
  description?: string
  created_at: string
}

export default function CaseDetailScreen({ route, navigation }: any) {
  const { caseId } = route.params
  const { profile } = useAuth()
  const isAdmin = profile?.role === 'admin' || profile?.role === 'lawyer'

  const [caseData, setCaseData] = useState<CaseData | null>(null)
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddTimeline, setShowAddTimeline] = useState(false)
  const [eventTitle, setEventTitle] = useState('')
  const [eventDesc, setEventDesc] = useState('')
  const [addingSaving, setAddingSaving] = useState(false)

  useEffect(() => { fetchCase() }, [caseId])

  async function fetchCase() {
    const [{ data: c }, { data: t }] = await Promise.all([
      supabase.from('cases').select('*').eq('id', caseId).single(),
      supabase.from('case_timeline').select('*').eq('case_id', caseId).order('created_at', { ascending: false }),
    ])
    setCaseData(c)
    setTimeline(t ?? [])
    setLoading(false)
  }

  async function handleAddTimeline() {
    if (!eventTitle.trim()) {
      Alert.alert('Error', 'Event title is required.')
      return
    }
    setAddingSaving(true)
    const { error } = await supabase.from('case_timeline').insert({
      case_id: caseId,
      event: eventTitle.trim(),
      description: eventDesc.trim() || null,
    })
    setAddingSaving(false)
    if (error) {
      Alert.alert('Error', error.message)
    } else {
      setEventTitle('')
      setEventDesc('')
      setShowAddTimeline(false)
      fetchCase()
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator color={Colors.gold} style={{ marginTop: Spacing.xl }} />
      </SafeAreaView>
    )
  }

  if (!caseData) {
    return (
      <SafeAreaView style={styles.safe}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.errorText}>Case not found</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Cases</Text>
        </TouchableOpacity>
        {isAdmin && (
          <TouchableOpacity style={styles.addTimelineBtn} onPress={() => setShowAddTimeline(true)}>
            <Text style={styles.addTimelineBtnText}>+ Timeline</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.caseHeader}>
          <Text style={styles.caseNumber}>{caseData.case_number}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{caseData.status.replace(/_/g, ' ').toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <InfoRow label="Visa Type" value={caseData.visa_type} />
          <InfoRow label="Opened" value={new Date(caseData.opened_date).toLocaleDateString()} />
          {caseData.assigned_attorney && (
            <InfoRow label="Attorney" value={caseData.assigned_attorney} />
          )}
          {caseData.description && (
            <InfoRow label="Description" value={caseData.description} />
          )}
        </View>

        <Text style={styles.sectionTitle}>Timeline</Text>
        {timeline.length === 0 ? (
          <Text style={styles.emptyText}>No timeline events yet</Text>
        ) : (
          timeline.map((event, i) => (
            <View key={event.id} style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              {i < timeline.length - 1 && <View style={styles.timelineLine} />}
              <View style={styles.timelineContent}>
                <Text style={styles.timelineEvent}>{event.event}</Text>
                {event.description && (
                  <Text style={styles.timelineDesc}>{event.description}</Text>
                )}
                <Text style={styles.timelineDate}>{new Date(event.created_at).toLocaleDateString()}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Timeline Modal */}
      <Modal visible={showAddTimeline} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.safe}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddTimeline(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Timeline Event</Text>
            <TouchableOpacity onPress={handleAddTimeline} disabled={addingSaving}>
              {addingSaving
                ? <ActivityIndicator size="small" color={Colors.gold} />
                : <Text style={styles.saveText}>Add</Text>
              }
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.fieldLabel}>Event Title *</Text>
            <TextInput
              style={styles.input}
              value={eventTitle}
              onChangeText={setEventTitle}
              placeholder="e.g. Documents Received, Application Filed"
              placeholderTextColor={Colors.gray}
            />
            <Text style={[styles.fieldLabel, { marginTop: Spacing.md }]}>Description (optional)</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              value={eventDesc}
              onChangeText={setEventDesc}
              placeholder="Additional details..."
              placeholderTextColor={Colors.gray}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ marginBottom: Spacing.sm }}>
      <Text style={{ ...Typography.label, color: Colors.gray }}>{label}</Text>
      <Text style={{ ...Typography.body, color: Colors.darkGray }}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  topBar: { backgroundColor: Colors.navy, padding: Spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { padding: Spacing.md },
  backText: { color: Colors.gold, ...Typography.body },
  addTimelineBtn: { backgroundColor: Colors.gold, borderRadius: Radius.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs },
  addTimelineBtnText: { ...Typography.label, color: Colors.navy },
  container: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  caseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  caseNumber: { ...Typography.h2, color: Colors.navy },
  statusBadge: { backgroundColor: Colors.navy, borderRadius: Radius.full, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs },
  statusText: { ...Typography.label, color: Colors.gold },
  infoCard: { backgroundColor: Colors.white, borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.lg, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  sectionTitle: { ...Typography.h3, color: Colors.navy, marginBottom: Spacing.md },
  emptyText: { ...Typography.body, color: Colors.gray, textAlign: 'center', marginVertical: Spacing.lg },
  timelineItem: { flexDirection: 'row', marginBottom: Spacing.lg, position: 'relative' },
  timelineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.gold, marginTop: 4, marginRight: Spacing.md, flexShrink: 0 },
  timelineLine: { position: 'absolute', left: 5, top: 16, bottom: -Spacing.lg, width: 2, backgroundColor: Colors.lightGray },
  timelineContent: { flex: 1 },
  timelineEvent: { ...Typography.body, color: Colors.navy, fontWeight: '600' },
  timelineDesc: { ...Typography.small, color: Colors.gray, marginTop: 2 },
  timelineDate: { ...Typography.small, color: Colors.gray, marginTop: 4 },
  errorText: { ...Typography.body, color: Colors.danger, textAlign: 'center', margin: Spacing.xl },
  modalHeader: { backgroundColor: Colors.navy, padding: Spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cancelText: { color: Colors.gray, ...Typography.body },
  modalTitle: { ...Typography.h3, color: Colors.white },
  saveText: { color: Colors.gold, ...Typography.body, fontWeight: '600' },
  modalContent: { padding: Spacing.lg },
  fieldLabel: { ...Typography.label, color: Colors.darkGray, marginBottom: Spacing.xs },
  input: { borderWidth: 1, borderColor: Colors.lightGray, borderRadius: Radius.sm, padding: Spacing.md, fontSize: 15, color: Colors.darkGray, backgroundColor: Colors.white },
  textarea: { minHeight: 80, textAlignVertical: 'top' },
})
