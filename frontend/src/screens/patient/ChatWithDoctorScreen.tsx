import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';

interface ChatMessage {
  id: number;
  sender: 'doctor' | 'patient';
  text: string;
  time: string;
}

export const ChatWithDoctorScreen = ({ navigation }: any) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, sender: 'doctor', text: 'Hello Rajesh, I reviewed your CBC report. Your platelets dropped to 80,000. Please stay hydrated.', time: '10:30 AM' },
    { id: 2, sender: 'patient', text: 'Thank you Dr. Sharma. My fever has come down to 99.1°F today. Should I repeat the CBC test tomorrow?', time: '10:35 AM' },
    { id: 3, sender: 'doctor', text: 'Yes, please get a repeat CBC done tomorrow morning at 8:00 AM.', time: '10:40 AM' }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: 'patient', text: inputText, time: 'Just now' }]);
    setInputText('');
  };

  return (
    <View style={styles.container}>
      {/* Doctor Status Header */}
      <View style={styles.header}>
        <Text style={styles.docTitle}>💬 Dr. Priya Sharma</Text>
        <Text style={styles.statusOnline}>🟢 Online</Text>
      </View>

      {/* Emergency Banner */}
      <TouchableOpacity style={styles.emergencyBanner} onPress={() => navigation.navigate('EmergencyInfo')}>
        <Text style={styles.emergencyText}>⚠️ For severe symptoms or bleeding emergency, call 108 immediately</Text>
      </TouchableOpacity>

      {/* Message List */}
      <ScrollView style={styles.chatArea}>
        {messages.map((msg: ChatMessage) => {
          const isPatient = msg.sender === 'patient';
          return (
            <View key={msg.id} style={[styles.bubbleWrapper, isPatient ? styles.bubbleRight : styles.bubbleLeft]}>
              <View style={[styles.bubble, isPatient ? styles.bubblePatient : styles.bubbleDoctor]}>
                <Text style={[styles.msgText, isPatient ? styles.msgTextPatient : styles.msgTextDoctor]}>
                  {msg.text}
                </Text>
                <Text style={[styles.msgTime, isPatient ? { color: 'rgba(255,255,255,0.7)' } : { color: COLORS.textSecondary }]}>
                  {msg.time}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputBar}>
        <TextInput 
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message to doctor..."
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendBtnText}>➔</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  docTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primary
  },
  statusOnline: {
    ...TYPOGRAPHY.small,
    fontWeight: '700',
    color: COLORS.secondary
  },
  emergencyBanner: {
    backgroundColor: '#FEF2F2',
    padding: 8,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FCA5A5'
  },
  emergencyText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.error,
    fontWeight: '700'
  },
  chatArea: {
    flex: 1,
    padding: SPACING.md
  },
  bubbleWrapper: {
    marginBottom: SPACING.sm,
    maxWidth: '80%'
  },
  bubbleLeft: {
    alignSelf: 'flex-start'
  },
  bubbleRight: {
    alignSelf: 'flex-end'
  },
  bubble: {
    borderRadius: 16,
    padding: 12
  },
  bubbleDoctor: {
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  bubblePatient: {
    backgroundColor: COLORS.primary
  },
  msgText: {
    ...TYPOGRAPHY.body,
    fontSize: 15
  },
  msgTextDoctor: {
    color: COLORS.textPrimary
  },
  msgTextPatient: {
    color: '#FFF'
  },
  msgTime: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end'
  },
  inputBar: {
    flexDirection: 'row',
    padding: SPACING.sm,
    backgroundColor: COLORS.cardBackground,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'center'
  },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    marginRight: 8
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sendBtnText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700'
  }
});
