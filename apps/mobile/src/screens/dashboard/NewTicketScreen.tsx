import React, { useState } from 'react'
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../lib/supabase'
import { Colors, Typography, Spacing, Radius } from '../../theme'

export default function NewTicketScreen({ navigation, route }: any) {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!subject.trim() || !body.trim()) {
      Alert.alert('Error', 'Please fill in all fields.')
      return
    }
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { error } = await supabase.from('tickets').insert({
      user_id: user.id,
      subject: subject.trim(),
      body: body.trim(),
      status: 'open',
    })

    setLoading(false)
    if (error) {
      Alert.alert('Error', 'Could not create ticket. Please try again.')
      return
    }

    route.params?.onCreated?.()
    navigation.goBack()
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>New Support Ticket</Text>
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.label}>Subject *</Text>
          <TextInput
            style={styles.input}
            value={subject}
            onChangeText={setSubject}
            placeholder="Brief description of your issue"
            placeholderTextColor={Colors.gray}
          />

          <Text style={[styles.label, { marginTop: Spacing.md }]}>Message *</Text>
          <TextInput
            style={[styles.input, styles.bodyInput]}
            value={body}
            onChangeText={setBody}
            placeholder="Please describe your issue in detail..."
            placeholderTextColor={Colors.gray}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
            {loading
              ? <ActivityIndicator color={Colors.navy} />
              : <Text style={styles.submitBtnText}>Submit Ticket</Text>
            }
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  topBar: { backgroundColor: Colors.navy, padding: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  backText: { color: Colors.gold, ...Typography.body },
  topTitle: { ...Typography.h3, color: Colors.white },
  container: { padding: Spacing.lg },
  label: { ...Typography.label, color: Colors.darkGray, marginBottom: Spacing.xs },
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: Radius.sm,
    padding: Spacing.md,
    fontSize: 15,
    color: Colors.darkGray,
    backgroundColor: Colors.white,
    marginBottom: Spacing.sm,
  },
  bodyInput: { minHeight: 140 },
  submitBtn: {
    backgroundColor: Colors.gold,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  submitBtnText: { ...Typography.h3, color: Colors.navy },
})
