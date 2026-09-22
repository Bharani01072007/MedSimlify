import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';
import { askAiAssistantApi, getReportsApi } from '../../lib/api-client';

interface Message {
  id: number;
  sender: 'ai' | 'user';
  text: string;
  isRag?: boolean;
}

interface ReportItem {
  id: number;
  file_name: string;
}

export const AIHealthAssistantScreen = ({ navigation }: any) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'ai',
      text: "👋 Hello! I'm your MedSimplify AI Health Assistant.\n\n💡 Select an uploaded lab report chip below to perform AI lab report analysis, or uncheck for general health advice."
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [selectedReportIds, setSelectedReportIds] = useState<number[]>([]);

  useEffect(() => {
    async function loadReports() {
      try {
        const data = await getReportsApi(1);
        if (Array.isArray(data) && data.length > 0) {
          setReports(data);
          setSelectedReportIds([data[0].id]);
        }
      } catch (err) {
        console.log("Failed to load reports in mobile assistant:", err);
      }
    }
    loadReports();
  }, []);

  const toggleReport = (id: number) => {
    setSelectedReportIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const quickQuestions = [
    "What to eat in dengue?",
    "When to repeat blood test?",
    "Is platelet count 80,000 dangerous?"
  ];

  const handleAsk = async (q?: string) => {
    const questionText = q || inputText;
    if (!questionText.trim()) return;

    const userMsg: Message = { id: Date.now(), sender: 'user', text: questionText };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    try {
      const res = await askAiAssistantApi(questionText, "en", selectedReportIds);
      const aiMsg: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        text: res?.answer || "AI service responded.",
        isRag: res?.is_rag
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      let aiReply = "🤖 **MedSimplify AI Advice:**\n\n• Maintain regular hydration (3-4 liters daily).\n• Avoid self-medicating with Aspirin or Ibuprofen.\n\n⚠️ *Always consult your physician.*";
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'ai', text: aiReply }
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🤖 MedSimplify AI RAG Assistant</Text>
        <Text style={styles.headerSub}>Select report context for RAG or ask general health questions</Text>

        {/* Report Context Selector Chips */}
        {reports.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.reportSelectorScroll}>
            <Text style={styles.contextLabel}>📎 RAG Context:</Text>
            {reports.map((r) => {
              const isSelected = selectedReportIds.includes(r.id);
              return (
                <TouchableOpacity
                  key={r.id}
                  style={[styles.reportChip, isSelected && styles.reportChipSelected]}
                  onPress={() => toggleReport(r.id)}
                >
                  <Text style={[styles.reportChipText, isSelected && styles.reportChipTextSelected]}>
                    {isSelected ? '✓ ' : '+ '}{r.file_name || `Report #${r.id}`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* Quick Suggestions Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
        {quickQuestions.map((q) => (
          <TouchableOpacity key={q} style={styles.chip} onPress={() => handleAsk(q)}>
            <Text style={styles.chipText}>💬 {q}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Chat Messages */}
      <ScrollView style={styles.chatArea}>
        {messages.map((m: Message) => {
          const isUser = m.sender === 'user';
          return (
            <View key={m.id} style={[styles.msgWrapper, isUser ? styles.msgUser : styles.msgAI]}>
              {!isUser && m.isRag && (
                <View style={styles.ragBadge}>
                  <Text style={styles.ragBadgeText}>⚡ RAG Report Answer</Text>
                </View>
              )}
              <View style={[styles.msgBubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
                <Text style={[styles.msgText, isUser ? { color: '#FFF' } : { color: COLORS.textPrimary }]}>
                  {m.text}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputBar}>
        <TextInput 
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder={selectedReportIds.length > 0 ? "Ask question on selected report(s)..." : "Ask general health question..."}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={() => handleAsk()}>
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
    padding: SPACING.md,
    backgroundColor: COLORS.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  headerTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primary
  },
  headerSub: {
    ...TYPOGRAPHY.caption,
    marginBottom: 8
  },
  reportSelectorScroll: {
    flexDirection: 'row',
    marginTop: 4
  },
  contextLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    alignSelf: 'center',
    marginRight: 6
  },
  reportChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 6
  },
  reportChipSelected: {
    backgroundColor: '#059669',
    borderColor: '#047857'
  },
  reportChipText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500'
  },
  reportChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  chipScroll: {
    padding: SPACING.sm,
    backgroundColor: COLORS.cardBackground
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginRight: 8
  },
  chipText: {
    ...TYPOGRAPHY.small,
    color: COLORS.primary,
    fontWeight: '600'
  },
  chatArea: {
    flex: 1,
    padding: SPACING.md
  },
  msgWrapper: {
    marginBottom: SPACING.sm
  },
  msgUser: {
    alignSelf: 'flex-end',
    maxWidth: '80%'
  },
  msgAI: {
    alignSelf: 'flex-start',
    maxWidth: '90%'
  },
  ragBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4
  },
  ragBadgeText: {
    fontSize: 10,
    color: '#065F46',
    fontWeight: '700'
  },
  msgBubble: {
    borderRadius: 12,
    padding: 12
  },
  bubbleUser: {
    backgroundColor: COLORS.primary
  },
  bubbleAI: {
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  msgText: {
    ...TYPOGRAPHY.body,
    lineHeight: 22
  },
  inputBar: {
    flexDirection: 'row',
    padding: SPACING.sm,
    backgroundColor: COLORS.cardBackground,
    borderTopWidth: 1,
    borderTopColor: COLORS.border
  },
  input: {
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
