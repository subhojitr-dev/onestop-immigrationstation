import React, { useEffect, useState, useRef } from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, Alert, Switch,
} from 'react-native'
import { SafeAreaView } from 'react-native'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/AuthContext'
import { Colors, Typography, Spacing, Radius } from '../../theme'
import { questionnaires } from '../../questionnaire/index'
import type { VisaQuestionnaire, Section, QuestionField } from '../../questionnaire/types'

type Answers = Record<string, string | boolean | number>

export default function QuestionnaireScreen({ route, navigation }: any) {
  const { visaType } = route.params
  const { user } = useAuth()

  const questionnaire: VisaQuestionnaire | undefined = questionnaires[visaType as keyof typeof questionnaires]

  const [appId, setAppId] = useState<string | null>(null)
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const scrollRef = useRef<ScrollView>(null)

  useEffect(() => {
    if (questionnaire && user) loadOrCreateApp()
  }, [user])

  async function loadOrCreateApp() {
    if (!user || !questionnaire) return

    // Check for existing draft
    const { data: existing } = await supabase
      .from('applications')
      .select('id, data, status')
      .eq('user_id', user.id)
      .eq('visa_type', visaType)
      .eq('status', 'draft')
      .single()

    if (existing) {
      setAppId(existing.id)
      const savedAnswers = existing.data ?? {}
      setAnswers(savedAnswers)
      // Resume from last saved section
      const lastSection = savedAnswers.__lastSection as number ?? 0
      setCurrentSectionIndex(Math.min(lastSection, questionnaire.sections.length - 1))
    } else {
      // Create new application
      const { data: newApp } = await supabase
        .from('applications')
        .insert({
          user_id: user.id,
          visa_type: visaType,
          status: 'draft',
          data: {},
        })
        .select('id')
        .single()
      if (newApp) setAppId(newApp.id)
    }
    setLoading(false)
  }

  async function saveProgress(updatedAnswers: Answers, sectionIndex: number) {
    if (!appId) return
    setSaving(true)
    await supabase
      .from('applications')
      .update({
        data: { ...updatedAnswers, __lastSection: sectionIndex },
        updated_at: new Date().toISOString(),
      })
      .eq('id', appId)
    setSaving(false)
  }

  async function handleNext() {
    if (!questionnaire) return
    const updatedAnswers = { ...answers, __lastSection: currentSectionIndex + 1 }
    await saveProgress(updatedAnswers, currentSectionIndex + 1)

    if (currentSectionIndex < questionnaire.sections.length - 1) {
      setCurrentSectionIndex(i => i + 1)
      scrollRef.current?.scrollTo({ y: 0, animated: true })
    }
  }

  async function handleBack() {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(i => i - 1)
      scrollRef.current?.scrollTo({ y: 0, animated: true })
    } else {
      navigation.goBack()
    }
  }

  async function handleSubmit() {
    Alert.alert(
      'Submit Application',
      'Are you sure you want to submit? You cannot edit it after submission.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: async () => {
            setSaving(true)
            await supabase
              .from('applications')
              .update({ status: 'submitted', data: answers })
              .eq('id', appId)

            // Notify web API
            const apiUrl = process.env.EXPO_PUBLIC_API_URL
            fetch(`${apiUrl}/api/email`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ type: 'application_submitted', userId: user!.id }),
            }).catch(() => {})

            setSaving(false)
            Alert.alert(
              'Application Submitted! 🎉',
              'Your application has been submitted. Our team will review it and be in touch.',
              [{ text: 'OK', onPress: () => navigation.navigate('ApplicationStatus') }]
            )
          },
        },
      ]
    )
  }

  function setAnswer(fieldId: string, value: string | boolean) {
    setAnswers(prev => ({ ...prev, [fieldId]: value }))
  }

  function isFieldVisible(field: QuestionField): boolean {
    if (!field.showIf) return true
    const watchValue = answers[field.showIf.field]
    if (Array.isArray(field.showIf.value)) {
      return field.showIf.value.includes(watchValue as string)
    }
    return watchValue === field.showIf.value
  }

  function renderField(field: QuestionField) {
    if (!isFieldVisible(field)) return null

    switch (field.type) {
      case 'heading':
        return (
          <Text key={field.id} style={styles.fieldHeading}>{field.text}</Text>
        )

      case 'info':
        return (
          <View key={field.id} style={styles.infoBox}>
            <Text style={styles.infoText}>ℹ️  {field.text}</Text>
          </View>
        )

      case 'text':
      case 'email':
      case 'tel':
      case 'number':
        return (
          <View key={field.id} style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              {field.label}{field.required ? ' *' : ''}
            </Text>
            {field.hint && <Text style={styles.hint}>{field.hint}</Text>}
            <TextInput
              style={styles.input}
              value={(answers[field.id] as string) ?? ''}
              onChangeText={v => setAnswer(field.id, v)}
              placeholder={field.placeholder ?? ''}
              placeholderTextColor={Colors.gray}
              keyboardType={
                field.type === 'email' ? 'email-address' :
                field.type === 'tel' ? 'phone-pad' :
                field.type === 'number' ? 'numeric' : 'default'
              }
              autoCapitalize={field.type === 'email' ? 'none' : 'sentences'}
            />
            {field.uscisRef && <Text style={styles.uscisRef}>{field.uscisRef}</Text>}
          </View>
        )

      case 'textarea':
        return (
          <View key={field.id} style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              {field.label}{field.required ? ' *' : ''}
            </Text>
            {field.hint && <Text style={styles.hint}>{field.hint}</Text>}
            <TextInput
              style={[styles.input, styles.textarea]}
              value={(answers[field.id] as string) ?? ''}
              onChangeText={v => setAnswer(field.id, v)}
              placeholder={field.placeholder ?? ''}
              placeholderTextColor={Colors.gray}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        )

      case 'date':
        return (
          <View key={field.id} style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              {field.label}{field.required ? ' *' : ''}
            </Text>
            {field.hint && <Text style={styles.hint}>{field.hint}</Text>}
            <TextInput
              style={styles.input}
              value={(answers[field.id] as string) ?? ''}
              onChangeText={v => setAnswer(field.id, v)}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={Colors.gray}
              keyboardType="numeric"
            />
          </View>
        )

      case 'select':
        return (
          <View key={field.id} style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              {field.label}{field.required ? ' *' : ''}
            </Text>
            {field.hint && <Text style={styles.hint}>{field.hint}</Text>}
            <View style={styles.optionsWrap}>
              {field.options?.map(opt => (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.selectOption,
                    answers[field.id] === opt.value && styles.selectOptionActive,
                  ]}
                  onPress={() => setAnswer(field.id, opt.value)}
                >
                  <Text style={[
                    styles.selectOptionText,
                    answers[field.id] === opt.value && styles.selectOptionTextActive,
                  ]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )

      case 'radio':
        return (
          <View key={field.id} style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              {field.label}{field.required ? ' *' : ''}
            </Text>
            {field.hint && <Text style={styles.hint}>{field.hint}</Text>}
            {field.options?.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.radioOption,
                  answers[field.id] === opt.value && styles.radioOptionActive,
                ]}
                onPress={() => setAnswer(field.id, opt.value)}
              >
                <View style={[
                  styles.radioCircle,
                  answers[field.id] === opt.value && styles.radioCircleActive,
                ]} />
                <Text style={[
                  styles.radioText,
                  answers[field.id] === opt.value && styles.radioTextActive,
                ]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )

      case 'checkbox':
        return (
          <View key={field.id} style={styles.fieldGroup}>
            <View style={styles.checkboxRow}>
              <Switch
                value={answers[field.id] === 'true' || answers[field.id] === true}
                onValueChange={v => setAnswer(field.id, v ? 'true' : 'false')}
                trackColor={{ false: Colors.lightGray, true: Colors.gold }}
                thumbColor={Colors.white}
              />
              <Text style={styles.checkboxLabel}>{field.label}</Text>
            </View>
            {field.hint && <Text style={styles.hint}>{field.hint}</Text>}
          </View>
        )

      default:
        return null
    }
  }

  if (!questionnaire) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.errorText}>Questionnaire not found for visa type: {visaType}</Text>
      </SafeAreaView>
    )
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator color={Colors.gold} style={{ marginTop: Spacing.xl }} />
        <Text style={styles.loadingText}>Loading questionnaire...</Text>
      </SafeAreaView>
    )
  }

  const section: Section = questionnaire.sections[currentSectionIndex]
  const isLastSection = currentSectionIndex === questionnaire.sections.length - 1
  const progress = (currentSectionIndex + 1) / questionnaire.sections.length

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.topBarCenter}>
          <Text style={styles.topBarTitle}>{questionnaire.label}</Text>
          <Text style={styles.topBarSection}>
            Section {currentSectionIndex + 1} of {questionnaire.sections.length}
          </Text>
        </View>
        {saving
          ? <ActivityIndicator size="small" color={Colors.gold} />
          : <Text style={styles.savedText}>Saved ✓</Text>
        }
      </View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <ScrollView ref={scrollRef} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Section header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>{section.icon}</Text>
          <View>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
          </View>
        </View>

        {/* Fields */}
        {section.fields.map(field => renderField(field))}

        {/* Navigation buttons */}
        <View style={styles.navButtons}>
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>

          {isLastSection ? (
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSubmit}
              disabled={saving}
            >
              {saving
                ? <ActivityIndicator color={Colors.navy} />
                : <Text style={styles.submitBtnText}>Submit Application 🎉</Text>
              }
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.nextBtn}
              onPress={handleNext}
              disabled={saving}
            >
              {saving
                ? <ActivityIndicator color={Colors.navy} />
                : <Text style={styles.nextBtnText}>Next Section →</Text>
              }
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    backgroundColor: Colors.navy,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backText: { color: Colors.gold, ...Typography.body, minWidth: 60 },
  topBarCenter: { flex: 1, alignItems: 'center' },
  topBarTitle: { ...Typography.small, color: Colors.white, fontWeight: '600' },
  topBarSection: { ...Typography.small, color: Colors.gray, fontSize: 11 },
  savedText: { ...Typography.small, color: Colors.gold, minWidth: 60, textAlign: 'right' },
  progressBar: { height: 4, backgroundColor: Colors.navyMid },
  progressFill: { height: 4, backgroundColor: Colors.gold },
  container: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionIcon: { fontSize: 32 },
  sectionTitle: { ...Typography.h3, color: Colors.navy },
  sectionSubtitle: { ...Typography.small, color: Colors.gray, marginTop: 2 },
  fieldGroup: { marginBottom: Spacing.lg },
  fieldLabel: { ...Typography.label, color: Colors.darkGray, marginBottom: Spacing.xs },
  fieldHeading: {
    ...Typography.body,
    color: Colors.navy,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    borderRadius: Radius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.info,
  },
  infoText: { ...Typography.small, color: '#1e40af', lineHeight: 20 },
  hint: { ...Typography.small, color: Colors.gray, marginBottom: Spacing.xs, fontStyle: 'italic' },
  uscisRef: { ...Typography.small, color: Colors.gray, fontSize: 10, marginTop: 2, fontStyle: 'italic' },
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: Radius.sm,
    padding: Spacing.md,
    fontSize: 15,
    color: Colors.darkGray,
    backgroundColor: Colors.white,
  },
  textarea: { minHeight: 100, textAlignVertical: 'top' },
  optionsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  selectOption: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
  },
  selectOptionActive: { borderColor: Colors.navy, backgroundColor: Colors.navy },
  selectOptionText: { ...Typography.small, color: Colors.darkGray },
  selectOptionTextActive: { color: Colors.white },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: Radius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.white,
  },
  radioOptionActive: { borderColor: Colors.gold, backgroundColor: Colors.gold + '11' },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: Colors.gray,
  },
  radioCircleActive: { borderColor: Colors.gold, backgroundColor: Colors.gold },
  radioText: { ...Typography.body, color: Colors.darkGray, flex: 1 },
  radioTextActive: { color: Colors.navy, fontWeight: '600' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  checkboxLabel: { ...Typography.body, color: Colors.darkGray, flex: 1 },
  navButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  backBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  backBtnText: { ...Typography.body, color: Colors.darkGray },
  nextBtn: {
    flex: 2,
    backgroundColor: Colors.gold,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  nextBtnText: { ...Typography.h3, color: Colors.navy },
  submitBtn: {
    flex: 2,
    backgroundColor: Colors.success,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  submitBtnText: { ...Typography.h3, color: Colors.white },
  loadingText: { textAlign: 'center', color: Colors.gray, marginTop: Spacing.md },
  errorText: { ...Typography.body, color: Colors.danger, textAlign: 'center', margin: Spacing.xl },
})
