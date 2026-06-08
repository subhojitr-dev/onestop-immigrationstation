import React, { useEffect, useState } from 'react'
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/AuthContext'
import { Colors, Typography, Spacing, Radius } from '../../theme'

interface Reply {
  id: string
  body: string
  created_at: string
  user_id: string
  profiles?: { full_name: string; role: string }
}

interface Ticket {
  id: string
  subject: string
  body: string
  status: string
  created_at: string
}

export default function TicketDetailScreen({ route, navigation }: any) {
  const { ticketId } = route.params
  const { user } = useAuth()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [replies, setReplies] = useState<Reply[]>([])
  const [replyText, setReplyText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetchTicket()
  }, [ticketId])

  async function fetchTicket() {
    const [{ data: t }, { data: r }] = await Promise.all([
      supabase.from('tickets').select('*').eq('id', ticketId).single(),
      supabase.from('ticket_replies').select('*, profiles(full_name, role)').eq('ticket_id', ticketId).order('created_at'),
    ])
    setTicket(t)
    setReplies(r ?? [])
    setLoading(false)
  }

  async function handleReply() {
    if (!replyText.trim()) return
    setSending(true)
    await supabase.from('ticket_replies').insert({
      ticket_id: ticketId,
      user_id: user!.id,
      body: replyText.trim(),
    })
    setReplyText('')
    await fetchTicket()
    setSending(false)
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator color={Colors.gold} style={{ marginTop: Spacing.xl }} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Tickets</Text>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          data={replies}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={ticket ? (
            <View style={styles.ticketHeader}>
              <Text style={styles.subject}>{ticket.subject}</Text>
              <Text style={styles.ticketBody}>{ticket.body}</Text>
              <Text style={styles.meta}>{new Date(ticket.created_at).toLocaleDateString()}</Text>
            </View>
          ) : null}
          ListEmptyComponent={<Text style={styles.noReplies}>No replies yet</Text>}
          renderItem={({ item }) => {
            const isOwn = item.user_id === user?.id
            const isStaff = ['lawyer', 'admin'].includes((item.profiles as any)?.role ?? '')
            return (
              <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
                {!isOwn && (
                  <Text style={styles.bubbleSender}>
                    {(item.profiles as any)?.full_name ?? 'Staff'}{isStaff ? ' (Staff)' : ''}
                  </Text>
                )}
                <Text style={[styles.bubbleText, isOwn && styles.bubbleTextOwn]}>{item.body}</Text>
                <Text style={[styles.bubbleMeta, isOwn && styles.bubbleMetaOwn]}>
                  {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            )
          }}
        />
        <View style={styles.replyBar}>
          <TextInput
            style={styles.replyInput}
            value={replyText}
            onChangeText={setReplyText}
            placeholder="Type your reply..."
            placeholderTextColor={Colors.gray}
            multiline
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleReply} disabled={sending || !replyText.trim()}>
            {sending ? <ActivityIndicator color={Colors.white} size="small" /> : <Text style={styles.sendBtnText}>Send</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  topBar: { backgroundColor: Colors.navy, padding: Spacing.md },
  backText: { color: Colors.gold, ...Typography.body },
  list: { padding: Spacing.lg, paddingBottom: Spacing.md },
  ticketHeader: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  subject: { ...Typography.h3, color: Colors.navy, marginBottom: Spacing.sm },
  ticketBody: { ...Typography.body, color: Colors.darkGray, marginBottom: Spacing.sm },
  meta: { ...Typography.small, color: Colors.gray },
  noReplies: { ...Typography.body, color: Colors.gray, textAlign: 'center', marginVertical: Spacing.lg },
  bubble: {
    maxWidth: '80%',
    borderRadius: Radius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
    backgroundColor: Colors.white,
    alignSelf: 'flex-start',
  },
  bubbleOwn: { alignSelf: 'flex-end', backgroundColor: Colors.navy },
  bubbleOther: {},
  bubbleSender: { ...Typography.label, color: Colors.gray, marginBottom: 2 },
  bubbleText: { ...Typography.body, color: Colors.darkGray },
  bubbleTextOwn: { color: Colors.white },
  bubbleMeta: { ...Typography.small, color: Colors.gray, marginTop: 2, textAlign: 'right' },
  bubbleMetaOwn: { color: Colors.gold },
  replyBar: {
    flexDirection: 'row',
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    gap: Spacing.sm,
    alignItems: 'flex-end',
  },
  replyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    fontSize: 15,
    color: Colors.darkGray,
    maxHeight: 100,
  },
  sendBtn: {
    backgroundColor: Colors.navy,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minWidth: 60,
    alignItems: 'center',
  },
  sendBtnText: { ...Typography.label, color: Colors.gold },
})
