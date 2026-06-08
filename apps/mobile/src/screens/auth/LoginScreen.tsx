'use client'
import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../lib/supabase'
import { Colors, Typography, Spacing, Radius } from '../../theme'

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter your email and password.')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setLoading(false)
    if (error) Alert.alert('Login Failed', error.message)
  }

  async function handleForgotPassword() {
    if (!email.trim()) {
      Alert.alert('Enter Email', 'Enter your email address above, then tap Forgot Password.')
      return
    }
    setLoading(true)
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL
      await fetch(`${apiUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      Alert.alert('Email Sent', 'Check your inbox for a password reset link.')
    } catch {
      Alert.alert('Error', 'Could not send reset email. Please try again.')
    }
    setLoading(false)
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.logo}>⚖️</Text>
            <Text style={styles.title}>One Stop{'\n'}Immigration Station</Text>
            <Text style={styles.subtitle}>Sign in to your portal</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={Colors.gray}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={[styles.label, { marginTop: Spacing.md }]}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                value={password}
                onChangeText={setPassword}
                placeholder="Your password"
                placeholderTextColor={Colors.gray}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(v => !v)}>
                <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotLink}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
              {loading
                ? <ActivityIndicator color={Colors.navy} />
                : <Text style={styles.loginBtnText}>Sign In</Text>
              }
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.signupLink} onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupText}>
              Don't have an account? <Text style={{ color: Colors.gold, fontWeight: '600' }}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.navy },
  container: { flexGrow: 1, padding: Spacing.lg, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: Spacing.xl },
  logo: { fontSize: 48, marginBottom: Spacing.sm },
  title: {
    ...Typography.h1,
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: Spacing.sm,
  },
  subtitle: { ...Typography.body, color: Colors.gold },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
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
  passwordRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  eyeBtn: { padding: Spacing.sm, marginLeft: Spacing.xs },
  eyeText: { fontSize: 18 },
  forgotLink: { alignSelf: 'flex-end', marginBottom: Spacing.lg },
  forgotText: { ...Typography.small, color: Colors.gold },
  loginBtn: {
    backgroundColor: Colors.gold,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  loginBtnText: { ...Typography.h3, color: Colors.navy },
  signupLink: { alignItems: 'center' },
  signupText: { ...Typography.body, color: Colors.white },
})
