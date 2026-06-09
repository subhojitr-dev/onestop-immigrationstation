import React, { useEffect, useState } from 'react'
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, Alert, Linking,
} from 'react-native'
import { SafeAreaView } from 'react-native'
import * as DocumentPicker from 'expo-document-picker'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/AuthContext'
import { Colors, Typography, Spacing, Radius } from '../../theme'

interface Document {
  id: string
  name: string
  file_path: string
  file_type?: string
  file_size?: number
  created_at: string
}

export default function DocumentsScreen() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) fetchDocuments()
  }, [user])

  async function fetchDocuments() {
    if (!user) return
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (error) Alert.alert('Error loading documents', error.message)
    setDocuments(data ?? [])
    setLoading(false)
  }

  async function handleUpload() {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true })
    if (result.canceled || !result.assets?.[0]) return

    const file = result.assets[0]
    setUploading(true)

    if (!user) { setUploading(false); return }

    const fileExt = file.name.split('.').pop()
    const filePath = `${user.id}/${Date.now()}.${fileExt}`

    const response = await fetch(file.uri)
    const blob = await response.blob()

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, blob, { contentType: file.mimeType ?? 'application/octet-stream' })

    if (uploadError) {
      setUploading(false)
      Alert.alert('Upload Failed', uploadError.message)
      return
    }

    const { error: insertError } = await supabase.from('documents').insert({
      user_id: user.id,
      name: file.name,
      file_path: filePath,
      file_type: file.mimeType,
      file_size: file.size,
    })

    if (insertError) {
      setUploading(false)
      Alert.alert('Upload Failed', `File saved but record failed: ${insertError.message}`)
      return
    }

    await fetchDocuments()
    setUploading(false)
    Alert.alert('Uploaded', `${file.name} uploaded successfully.`)
  }

  async function handleDownload(doc: Document) {
    const { data } = await supabase.storage.from('documents').createSignedUrl(doc.file_path, 60)
    if (data?.signedUrl) {
      Linking.openURL(data.signedUrl)
    }
  }

  async function handleDelete(doc: Document) {
    Alert.alert('Delete Document', `Delete "${doc.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await supabase.storage.from('documents').remove([doc.file_path])
          await supabase.from('documents').delete().eq('id', doc.id)
          setDocuments(prev => prev.filter(d => d.id !== doc.id))
        },
      },
    ])
  }

  function formatSize(bytes?: number) {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Documents</Text>
        <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload} disabled={uploading}>
          {uploading
            ? <ActivityIndicator color={Colors.navy} size="small" />
            : <Text style={styles.uploadBtnText}>+ Upload</Text>
          }
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator color={Colors.gold} style={{ marginTop: Spacing.xl }} />
      ) : (
        <FlatList
          data={documents}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>📄</Text>
              <Text style={styles.emptyText}>No documents yet</Text>
              <TouchableOpacity style={styles.uploadBtnLarge} onPress={handleUpload}>
                <Text style={styles.uploadBtnText}>Upload Your First Document</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.docCard}>
              <View style={styles.docInfo}>
                <Text style={styles.docIcon}>
                  {item.file_type?.includes('pdf') ? '📕' : item.file_type?.includes('image') ? '🖼️' : '📄'}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.docName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.docMeta}>
                    {formatSize(item.file_size)} · {new Date(item.created_at).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <View style={styles.docActions}>
                <TouchableOpacity onPress={() => handleDownload(item)} style={styles.actionBtn}>
                  <Text style={styles.actionBtnText}>⬇</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item)} style={[styles.actionBtn, styles.deleteBtn]}>
                  <Text style={styles.deleteBtnText}>🗑</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.navy, padding: Spacing.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { ...Typography.h2, color: Colors.white },
  uploadBtn: { backgroundColor: Colors.gold, borderRadius: Radius.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, minWidth: 80, alignItems: 'center' },
  uploadBtnText: { ...Typography.label, color: Colors.navy },
  list: { padding: Spacing.lg, gap: Spacing.md },
  docCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  docInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  docIcon: { fontSize: 28 },
  docName: { ...Typography.body, color: Colors.navy, fontWeight: '600' },
  docMeta: { ...Typography.small, color: Colors.gray, marginTop: 2 },
  docActions: { flexDirection: 'row', gap: Spacing.sm },
  actionBtn: { backgroundColor: Colors.lightGray, borderRadius: Radius.sm, padding: Spacing.sm, width: 36, alignItems: 'center' },
  actionBtnText: { fontSize: 16 },
  deleteBtn: { backgroundColor: Colors.danger + '22' },
  deleteBtnText: { fontSize: 16 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: Spacing.xxl },
  emptyIcon: { fontSize: 64, marginBottom: Spacing.md },
  emptyText: { ...Typography.h3, color: Colors.navy, marginBottom: Spacing.lg },
  uploadBtnLarge: { backgroundColor: Colors.gold, borderRadius: Radius.md, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
})
