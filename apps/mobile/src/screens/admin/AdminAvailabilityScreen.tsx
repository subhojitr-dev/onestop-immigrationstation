import React, { useEffect, useState } from 'react'
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, ActivityIndicator, Alert, ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/AuthContext'
import { Colors, Typography, Spacing, Radius } from '../../theme'

interface Slot {
  id: string
  slot_date: string
  slot_time: string
  is_booked: boolean
  profiles?: Array<{ full_name: string }>
}

const TIME_OPTIONS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM',
]

export default function AdminAvailabilityScreen({ navigation }: any) {
  const { user } = useAuth()
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchSlots() }, [user])

  async function fetchSlots() {
    if (!user) return
    const { data } = await supabase
      .from('consultation_slots')
      .select('id, slot_date, slot_time, is_booked, profiles(full_name)')
      .eq('lawyer_id', user.id)
      .gte('slot_date', new Date().toISOString().split('T')[0])
      .order('slot_date')
      .order('slot_time')
    setSlots((data as Slot[]) ?? [])
    setLoading(false)
  }

  async function handleAddSlot() {
    if (!newDate || !newTime) {
      Alert.alert('Missing fields', 'Please enter a date and select a time.')
      return
    }
    if (!user) return
    setSaving(true)
    const { error } = await supabase.from('consultation_slots').insert({
      lawyer_id: user.id,
      slot_date: newDate,
      slot_time: newTime,
      is_booked: false,
    })
    setSaving(false)
    if (error) {
      Alert.alert('Error', error.message)
    } else {
      setNewDate('')
      setNewTime('')
      setAdding(false)
      fetchSlots()
    }
  }

  async function handleDelete(slotId: string, isBooked: boolean) {
    if (isBooked) {
      Alert.alert('Cannot Delete', 'This slot is already booked by a client.')
      return
    }
    Alert.alert('Delete Slot', 'Remove this availability slot?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          await supabase.from('consultation_slots').delete().eq('id', slotId)
          fetchSlots()
        },
      },
    ])
  }

  // Generate next 14 days for date picker
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i + 1)
    return d.toISOString().split('T')[0]
  })

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Admin</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Availability</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setAdding(!adding)}>
          <Text style={styles.addBtnText}>{adding ? 'Cancel' : '+ Add'}</Text>
        </TouchableOpacity>
      </View>

      {adding && (
        <View style={styles.addForm}>
          <Text style={styles.formTitle}>Add New Slot</Text>

          <Text style={styles.fieldLabel}>Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.md }}>
            {dates.map(d => (
              <TouchableOpacity
                key={d}
                style={[styles.dateChip, newDate === d && styles.dateChipActive]}
                onPress={() => setNewDate(d)}
              >
                <Text style={[styles.dateChipText, newDate === d && styles.dateChipTextActive]}>
                  {new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.fieldLabel}>Time</Text>
          <View style={styles.timeGrid}>
            {TIME_OPTIONS.map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.timeChip, newTime === t && styles.timeChipActive]}
                onPress={() => setNewTime(t)}
              >
                <Text style={[styles.timeChipText, newTime === t && styles.timeChipTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleAddSlot} disabled={saving}>
            {saving ? <ActivityIndicator color={Colors.navy} /> : <Text style={styles.saveBtnText}>Add Slot</Text>}
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <ActivityIndicator color={Colors.gold} style={{ marginTop: Spacing.xl }} />
      ) : slots.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🗓️</Text>
          <Text style={styles.emptyText}>No upcoming slots</Text>
          <Text style={styles.emptySubtext}>Tap + Add to set your availability</Text>
        </View>
      ) : (
        <FlatList
          data={slots}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const bookedBy = (item.profiles as any)?.full_name
            return (
              <View style={[styles.slotCard, item.is_booked && styles.slotCardBooked]}>
                <View style={styles.slotInfo}>
                  <Text style={styles.slotDate}>
                    {new Date(item.slot_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </Text>
                  <Text style={styles.slotTime}>{item.slot_time}</Text>
                  {item.is_booked && bookedBy && (
                    <Text style={styles.bookedBy}>Booked by: {bookedBy}</Text>
                  )}
                  {item.is_booked && !bookedBy && (
                    <Text style={styles.bookedBy}>Booked</Text>
                  )}
                </View>
                <View style={styles.slotRight}>
                  {item.is_booked ? (
                    <View style={styles.bookedBadge}>
                      <Text style={styles.bookedBadgeText}>BOOKED</Text>
                    </View>
                  ) : (
                    <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id, item.is_booked)}>
                      <Text style={styles.deleteBtnText}>🗑</Text>
                    </TouchableOpacity>
                  )}
                </View>
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
  header: { backgroundColor: Colors.navy, padding: Spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backText: { color: Colors.gold, ...Typography.body },
  title: { ...Typography.h3, color: Colors.white },
  addBtn: { backgroundColor: Colors.gold, borderRadius: Radius.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs },
  addBtnText: { ...Typography.label, color: Colors.navy },
  addForm: { backgroundColor: Colors.white, padding: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.lightGray },
  formTitle: { ...Typography.h3, color: Colors.navy, marginBottom: Spacing.md },
  fieldLabel: { ...Typography.label, color: Colors.darkGray, marginBottom: Spacing.xs },
  dateChip: { borderRadius: Radius.full, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, marginRight: Spacing.sm, borderWidth: 1, borderColor: Colors.lightGray, backgroundColor: Colors.offWhite },
  dateChipActive: { backgroundColor: Colors.navy, borderColor: Colors.navy },
  dateChipText: { ...Typography.small, color: Colors.darkGray },
  dateChipTextActive: { color: Colors.gold },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
  timeChip: { borderRadius: Radius.sm, paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, borderWidth: 1, borderColor: Colors.lightGray, backgroundColor: Colors.offWhite },
  timeChipActive: { backgroundColor: Colors.navy, borderColor: Colors.navy },
  timeChipText: { ...Typography.small, color: Colors.darkGray },
  timeChipTextActive: { color: Colors.gold },
  saveBtn: { backgroundColor: Colors.gold, borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center' },
  saveBtnText: { ...Typography.h3, color: Colors.navy },
  list: { padding: Spacing.lg, gap: Spacing.sm },
  slotCard: { backgroundColor: Colors.white, borderRadius: Radius.md, padding: Spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  slotCardBooked: { backgroundColor: Colors.gold + '11' },
  slotInfo: { flex: 1 },
  slotDate: { ...Typography.body, color: Colors.navy, fontWeight: '600' },
  slotTime: { ...Typography.body, color: Colors.darkGray },
  bookedBy: { ...Typography.small, color: Colors.gray, marginTop: 2 },
  slotRight: {},
  bookedBadge: { backgroundColor: Colors.success + '22', borderRadius: Radius.full, paddingHorizontal: Spacing.sm, paddingVertical: 2, borderWidth: 1, borderColor: Colors.success },
  bookedBadgeText: { fontSize: 9, color: Colors.success, fontWeight: '700' },
  deleteBtn: { padding: Spacing.sm },
  deleteBtnText: { fontSize: 18 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: Spacing.xxl },
  emptyIcon: { fontSize: 64, marginBottom: Spacing.md },
  emptyText: { ...Typography.h3, color: Colors.navy },
  emptySubtext: { ...Typography.body, color: Colors.gray, marginTop: Spacing.xs },
})
