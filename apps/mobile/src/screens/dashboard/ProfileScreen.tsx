import React, { useState } from 'react'
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/AuthContext'
import { Colors, Typography, Spacing, Radius } from '../../theme'

export default function ProfileScreen() {
  const { profile, signOut, refreshProfile } = useAuth()
  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [phone, setPhone] = useState(profile?.phone ?? '')
  const [saving, setSaving] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)

  async function handleSave() {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Full name is required.')
      return
    }
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSaving(false); return }

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName.trim(), phone: phone.trim() })
      .eq('id', user.id)

    setSaving(false)
    if (error) {
      Alert.alert('Error', 'Could not save profile. Please try again.')
    } else {
      await refreshProfile()
      Alert.alert('Saved', 'Your profile has been updated.')
    }
  }

  async function handleForgotPassword() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) return
    setResetLoading(true)
    const apiUrl = process.env.EXPO_PUBLIC_API_URL
    await fetch(`${apiUrl}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email }),
    })
    setResetLoading(false)
    Alert.alert('Email Sent', 'Check your inbox for a password reset link.')
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>My Profile</Text>
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(profile?.full_name ?? 'U').charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.roleBadge}>{profile?.role?.toUpperCase() ?? ''}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Your full name"
              placeholderTextColor={Colors.gray}
            />

            <Text style={[styles.label, { marginTop: Spacing.md }]}>Phone</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="+1 (555) 000-0000"
              placeholderTextColor={Colors.gray}
              keyboardType="phone-pad"
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
              {saving
                ? <ActivityIndicator color={Colors.navy} />
                : <Text style={styles.saveBtnText}>Save Changes</Text>
              }
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.secondaryBtn} onPress={handleForgotPassword} disabled={resetLoading}>
            {resetLoading
              ? <ActivityIndicator color={Colors.navy} size="small" />
              : <Text style={styles.secondaryBtnText}>🔑 Change Password</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity style={styles.signOutBtn} onPress={signOut}>
            <Text style={styles.signOutBtnText}>Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.navy, padding: Spacing.lg },
  title: { ...Typography.h2, color: Colors.white },
  container: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  avatarSection: { alignItems: 'center', marginBottom: Spacing.xl },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.navy,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  avatarText: { ...Typography.h1, color: Colors.gold },
  roleBadge: { ...Typography.label, color: Colors.gold },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  label: { ...Typography.label, color: Colors.darkGray, marginBottom: Spacing.xs },
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: Radius.sm,
    padding: Spacing.md,
    fontSize: 15,
    color: Colors.darkGray,
    backgroundColor: Colors.offWhite,
    marginBottom: Spacing.sm,
  },
  saveBtn: { backgroundColor: Colors.gold, borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center', marginTop: Spacing.sm },
  saveBtnText: { ...Typography.h3, color: Colors.navy },
  secondaryBtn: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  secondaryBtnText: { ...Typography.body, color: Colors.navy },
  signOutBtn: {
    backgroundColor: Colors.danger + '11',
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  signOutBtnText: { ...Typography.body, color: Colors.danger, fontWeight: '600' },
})
