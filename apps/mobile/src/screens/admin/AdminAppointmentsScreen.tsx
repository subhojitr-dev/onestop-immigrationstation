import React, { useEffect, useState } from 'react'
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, ActivityIndicator, Alert, Modal, ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native'
import { supabase } from '../../lib/supabase'
import { Colors, Typography, Spacing, Radius } from '../../theme'

interface Appointment {
  id: string
  date: string
  time_slot: string
  status: string
  location?: string
  meeting_link?: string
  notes?: string
  profiles?: Array<{ full_name: string }>
}

const STATUSES = ['pending', 'confirmed', 'cancelled', 'completed']

export default function AdminAppointmentsScreen({ navigation }: any) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Appointment | null>(null)
  const [editStatus, setEditStatus] = useState('')
  const [editLocation, setEditLocation] = useState('')
  const [editLink, setEditLink] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchAppointments() }, [])

  async function fetchAppointments() {
    const { data } = await supabase
      .from('appointments')
      .select('id, date, time_slot, status, location, meeting_link, notes, profiles(full_name)')
      .order('date', { ascending: false })
    setAppointments((data as Appointment[]) ?? [])
    setLoading(false)
  }

  function openEdit(appt: Appointment) {
    setSelected(appt)
    setEditStatus(appt.status)
    setEditLocation(appt.location ?? '')
    setEditLink(appt.meeting_link ?? '')
  }

  async function handleSave() {
    if (!selected) return
    setSaving(true)
    const { error } = await supabase
      .from('appointments')
      .update({ status: editStatus, location: editLocation || null, meeting_link: editLink || null })
      .eq('id', selected.id)
    setSaving(false)
    if (error) {
      Alert.alert('Error', 'Could not update. Run migration 009 in Supabase SQL Editor first.')
    } else {
      setSelected(null)
      fetchAppointments()
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Admin</Text>
        </TouchableOpacity>
        <Text style={styles.title}>All Appointments</Text>
        <View style={{ width: 60 }} />
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.gold} style={{ marginTop: Spacing.xl }} />
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const clientName = (item.profiles as any)?.full_name ?? 'Unknown'
            const statusColor = item.status === 'confirmed' ? Colors.success : item.status === 'cancelled' ? Colors.danger : Colors.warning
            return (
              <TouchableOpacity style={styles.card} onPress={() => openEdit(item)}>
                <View style={styles.cardHeader}>
                  <Text style={styles.clientName}>{clientName}</Text>
                  <View style={[styles.badge, { backgroundColor: statusColor + '22', borderColor: statusColor }]}>
                    <Text style={[styles.badgeText, { color: statusColor }]}>{item.status.toUpperCase()}</Text>
                  </View>
                </View>
                <Text style={styles.dateText}>
                  {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {item.time_slot}
                </Text>
                {item.location && <Text style={styles.detail}>📍 {item.location}</Text>}
                <Text style={styles.editHint}>Tap to update →</Text>
              </TouchableOpacity>
            )
          }}
        />
      )}

      {/* Edit Modal */}
      <Modal visible={!!selected} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.safe}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setSelected(null)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Update Appointment</Text>
            <TouchableOpacity onPress={handleSave} disabled={saving}>
              {saving ? <ActivityIndicator size="small" color={Colors.gold} /> : <Text style={styles.saveText}>Save</Text>}
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.sectionLabel}>Client: {(selected?.profiles as any)?.full_name}</Text>
            <Text style={styles.sectionLabel}>
              {selected?.date} at {selected?.time_slot}
            </Text>

            <Text style={[styles.fieldLabel, { marginTop: Spacing.lg }]}>Status</Text>
            <View style={styles.statusGrid}>
              {STATUSES.map(s => (
                <TouchableOpacity
                  key={s}
                  style={[styles.statusChip, editStatus === s && styles.statusChipActive]}
                  onPress={() => setEditStatus(s)}
                >
                  <Text style={[styles.chipText, editStatus === s && styles.chipTextActive]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {editStatus === 'confirmed' && (
              <>
                <Text style={[styles.fieldLabel, { marginTop: Spacing.lg }]}>Location</Text>
                <TextInput
                  style={styles.input}
                  value={editLocation}
                  onChangeText={setEditLocation}
                  placeholder="e.g. 123 Main St, Suite 100 or Zoom"
                  placeholderTextColor={Colors.gray}
                />
                <Text style={[styles.fieldLabel, { marginTop: Spacing.md }]}>Meeting Link (optional)</Text>
                <TextInput
                  style={styles.input}
                  value={editLink}
                  onChangeText={setEditLink}
                  placeholder="https://zoom.us/j/..."
                  placeholderTextColor={Colors.gray}
                  autoCapitalize="none"
                />
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.navy, padding: Spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backText: { color: Colors.gold, ...Typography.body },
  title: { ...Typography.h3, color: Colors.white },
  list: { padding: Spacing.lg, gap: Spacing.md },
  card: { backgroundColor: Colors.white, borderRadius: Radius.md, padding: Spacing.md, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs },
  clientName: { ...Typography.body, color: Colors.navy, fontWeight: '600', flex: 1 },
  badge: { borderRadius: Radius.full, paddingHorizontal: Spacing.sm, paddingVertical: 2, borderWidth: 1 },
  badgeText: { fontSize: 9, fontWeight: '700' },
  dateText: { ...Typography.body, color: Colors.darkGray },
  detail: { ...Typography.small, color: Colors.gray, marginTop: 2 },
  editHint: { ...Typography.small, color: Colors.gold, marginTop: Spacing.xs },
  modalHeader: { backgroundColor: Colors.navy, padding: Spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cancelText: { color: Colors.gray, ...Typography.body },
  modalTitle: { ...Typography.h3, color: Colors.white },
  saveText: { color: Colors.gold, ...Typography.body, fontWeight: '600' },
  modalContent: { padding: Spacing.lg },
  sectionLabel: { ...Typography.body, color: Colors.navy, fontWeight: '600', marginBottom: 2 },
  fieldLabel: { ...Typography.label, color: Colors.darkGray, marginBottom: Spacing.xs },
  statusGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  statusChip: { borderRadius: Radius.full, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderWidth: 1, borderColor: Colors.lightGray, backgroundColor: Colors.white },
  statusChipActive: { backgroundColor: Colors.navy, borderColor: Colors.navy },
  chipText: { ...Typography.small, color: Colors.gray, textTransform: 'capitalize' },
  chipTextActive: { color: Colors.gold },
  input: { borderWidth: 1, borderColor: Colors.lightGray, borderRadius: Radius.sm, padding: Spacing.md, fontSize: 15, color: Colors.darkGray, backgroundColor: Colors.white, marginBottom: Spacing.sm },
})
