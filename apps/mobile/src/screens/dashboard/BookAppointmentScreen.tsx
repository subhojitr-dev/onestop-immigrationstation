import React, { useState, useEffect } from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, Alert, Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../lib/supabase'
import { Colors, Typography, Spacing, Radius } from '../../theme'

interface Slot {
  id: string
  slot_time: string
  lawyer_id: string
  profiles?: Array<{ full_name: string }>
}

export default function BookAppointmentScreen({ navigation }: any) {
  const [selectedDate, setSelectedDate] = useState('')
  const [slots, setSlots] = useState<Slot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingSlots, setLoadingSlots] = useState(false)

  // Generate next 14 days
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i + 1)
    return d.toISOString().split('T')[0]
  })

  useEffect(() => {
    if (selectedDate) fetchSlots()
  }, [selectedDate])

  async function fetchSlots() {
    setLoadingSlots(true)
    setSelectedSlot(null)
    const { data } = await supabase
      .from('consultation_slots')
      .select('id, slot_time, lawyer_id, profiles(full_name)')
      .eq('slot_date', selectedDate)
      .eq('is_booked', false)
      .order('slot_time')
    setSlots(data ?? [])
    setLoadingSlots(false)
  }

  async function handleBook() {
    if (!selectedSlot) {
      Alert.alert('Select a Time', 'Please select an available time slot.')
      return
    }
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const lawyerName = Array.isArray(selectedSlot.profiles) ? selectedSlot.profiles[0]?.full_name ?? 'Attorney' : 'Attorney'

    const [bookResult] = await Promise.all([
      supabase.from('appointments').insert({
        user_id: user.id,
        date: selectedDate,
        time_slot: selectedSlot.slot_time,
        status: 'pending',
        lawyer_name: lawyerName,
        notes: notes.trim() || null,
      }),
    ])

    if (bookResult.error) {
      setLoading(false)
      Alert.alert('Error', 'Could not book appointment. Please try again.')
      return
    }

    await supabase
      .from('consultation_slots')
      .update({ is_booked: true, booked_by: user.id })
      .eq('id', selectedSlot.id)

    // Trigger confirmation email
    const apiUrl = process.env.EXPO_PUBLIC_API_URL
    fetch(`${apiUrl}/api/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'appointment_booked', userId: user.id, date: selectedDate, timeSlot: selectedSlot.slot_time }),
    }).catch(() => {})

    setLoading(false)
    Alert.alert('Appointment Booked!', `Your appointment on ${selectedDate} at ${selectedSlot.slot_time} has been booked.`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ])
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Appointments</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Book Appointment</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>Select a Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datesScroll}>
          {dates.map(d => (
            <TouchableOpacity
              key={d}
              style={[styles.dateChip, selectedDate === d && styles.dateChipActive]}
              onPress={() => setSelectedDate(d)}
            >
              <Text style={[styles.dateChipText, selectedDate === d && styles.dateChipTextActive]}>
                {formatDate(d)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {selectedDate !== '' && (
          <>
            <Text style={styles.sectionTitle}>Available Times</Text>
            {loadingSlots ? (
              <ActivityIndicator color={Colors.gold} />
            ) : slots.length === 0 ? (
              <Text style={styles.noSlots}>No available slots on this date. Try another day.</Text>
            ) : (
              <View style={styles.slotsGrid}>
                {slots.map(slot => (
                  <TouchableOpacity
                    key={slot.id}
                    style={[styles.slotChip, selectedSlot?.id === slot.id && styles.slotChipActive]}
                    onPress={() => setSelectedSlot(slot)}
                  >
                    <Text style={[styles.slotTime, selectedSlot?.id === slot.id && styles.slotTimeActive]}>
                      {slot.slot_time}
                    </Text>
                    {Array.isArray(slot.profiles) && slot.profiles[0]?.full_name && (
                      <Text style={[styles.slotLawyer, selectedSlot?.id === slot.id && { color: Colors.navy }]}>
                        {slot.profiles[0].full_name}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>Notes (optional)</Text>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="Any additional notes for the attorney..."
              placeholderTextColor={Colors.gray}
              multiline
              numberOfLines={3}
            />

            <TouchableOpacity
              style={[styles.confirmBtn, (!selectedSlot || loading) && styles.confirmBtnDisabled]}
              onPress={handleBook}
              disabled={!selectedSlot || loading}
            >
              {loading
                ? <ActivityIndicator color={Colors.navy} />
                : <Text style={styles.confirmBtnText}>Confirm Booking</Text>
              }
            </TouchableOpacity>
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
  sectionTitle: { ...Typography.h3, color: Colors.navy, marginBottom: Spacing.md },
  datesScroll: { marginBottom: Spacing.lg },
  dateChip: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  dateChipActive: { backgroundColor: Colors.navy, borderColor: Colors.navy },
  dateChipText: { ...Typography.small, color: Colors.darkGray },
  dateChipTextActive: { color: Colors.gold },
  noSlots: { ...Typography.body, color: Colors.gray, textAlign: 'center', marginVertical: Spacing.md },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
  slotChip: {
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    minWidth: '45%',
    alignItems: 'center',
  },
  slotChipActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  slotTime: { ...Typography.body, color: Colors.navy, fontWeight: '600' },
  slotTimeActive: { color: Colors.navy },
  slotLawyer: { ...Typography.small, color: Colors.gray, marginTop: 2 },
  notesInput: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: Radius.sm,
    padding: Spacing.md,
    fontSize: 15,
    color: Colors.darkGray,
    backgroundColor: Colors.white,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: Spacing.lg,
  },
  confirmBtn: {
    backgroundColor: Colors.gold,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  confirmBtnDisabled: { opacity: 0.4 },
  confirmBtnText: { ...Typography.h3, color: Colors.navy },
})
