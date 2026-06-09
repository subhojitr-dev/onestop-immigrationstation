import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../lib/supabase'
import { Colors, Typography, Spacing, Radius } from '../../theme'

type Role = 'beneficiary' | 'sponsor'

export default function SignupScreen({ navigation }: any) {
  const [step, setStep] = useState(1)
  const [role, setRole] = useState<Role | null>(null)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSignup() {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.')
      return
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.')
      return
    }
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName.trim(), role },
      },
    })

    if (error) {
      setLoading(false)
      Alert.alert('Signup Failed', error.message)
      return
    }

    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: fullName.trim(),
        phone: phone.trim(),
        role,
      })
    }

    setLoading(false)
    Alert.alert('Account Created', 'Check your email to confirm your account, then sign in.', [
      { text: 'OK', onPress: () => navigation.navigate('Login') },
    ])
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={styles.backBtn} onPress={() => step === 1 ? navigation.goBack() : setStep(1)}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Step {step} of 2</Text>
          </View>

          {step === 1 && (
            <View>
              <Text style={styles.sectionTitle}>I am a...</Text>
              {(['beneficiary', 'sponsor'] as Role[]).map(r => (
                <TouchableOpacity
                  key={r}
                  style={[styles.roleCard, role === r && styles.roleCardActive]}
                  onPress={() => setRole(r)}
                >
                  <Text style={styles.roleIcon}>{r === 'beneficiary' ? '👤' : '🏢'}</Text>
                  <View>
                    <Text style={[styles.roleTitle, role === r && styles.roleTextActive]}>
                      {r === 'beneficiary' ? 'Beneficiary' : 'Sponsor / Employer'}
                    </Text>
                    <Text style={styles.roleDesc}>
                      {r === 'beneficiary'
                        ? 'I am applying for an immigration benefit'
                        : 'I am sponsoring an employee or family member'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={[styles.nextBtn, !role && styles.nextBtnDisabled]}
                onPress={() => role && setStep(2)}
                disabled={!role}
              >
                <Text style={styles.nextBtnText}>Continue →</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 2 && (
            <View style={styles.card}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Your full legal name"
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

              <Text style={[styles.label, { marginTop: Spacing.md }]}>Email Address *</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={Colors.gray}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={[styles.label, { marginTop: Spacing.md }]}>Password *</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Minimum 6 characters"
                  placeholderTextColor={Colors.gray}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(v => !v)}>
                  <Text>{showPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.signupBtn} onPress={handleSignup} disabled={loading}>
                {loading
                  ? <ActivityIndicator color={Colors.navy} />
                  : <Text style={styles.signupBtnText}>Create Account</Text>
                }
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>
              Already have an account? <Text style={{ color: Colors.gold, fontWeight: '600' }}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.navy },
  container: { flexGrow: 1, padding: Spacing.lg },
  backBtn: { marginBottom: Spacing.md },
  backText: { color: Colors.gold, ...Typography.body },
  header: { marginBottom: Spacing.xl },
  title: { ...Typography.h1, color: Colors.white, marginBottom: Spacing.xs },
  subtitle: { ...Typography.body, color: Colors.gray },
  sectionTitle: { ...Typography.h3, color: Colors.white, marginBottom: Spacing.md },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.navyMid,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: Spacing.md,
  },
  roleCardActive: { borderColor: Colors.gold, backgroundColor: Colors.navyDark },
  roleIcon: { fontSize: 32 },
  roleTitle: { ...Typography.h3, color: Colors.white, marginBottom: 2 },
  roleTextActive: { color: Colors.gold },
  roleDesc: { ...Typography.small, color: Colors.gray },
  nextBtn: {
    backgroundColor: Colors.gold,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  nextBtnDisabled: { opacity: 0.4 },
  nextBtnText: { ...Typography.h3, color: Colors.navy },
  card: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.lg },
  label: { ...Typography.label, color: Colors.darkGray, marginBottom: Spacing.xs },
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: Radius.sm,
    padding: Spacing.md,
    fontSize: 15,
    color: Colors.darkGray,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.offWhite,
  },
  passwordRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  eyeBtn: { padding: Spacing.sm, marginLeft: Spacing.xs },
  signupBtn: {
    backgroundColor: Colors.gold,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  signupBtnText: { ...Typography.h3, color: Colors.navy },
  loginLink: { alignItems: 'center' },
  loginText: { ...Typography.body, color: Colors.white },
})
