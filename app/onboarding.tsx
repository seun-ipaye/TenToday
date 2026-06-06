import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useGoals } from '@/context/goals';
import { Colors } from '@/constants/theme';

const MAX_GOALS = 5;

export default function OnboardingScreen() {
  const [input, setInput] = useState('');
  const [names, setNames] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const { addGoal } = useGoals();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const canAdd = input.trim().length > 0 && names.length < MAX_GOALS;
  const canStart = names.length > 0;

  function handleAdd() {
    const trimmed = input.trim();
    if (!trimmed || names.length >= MAX_GOALS) return;
    setNames((prev) => [...prev, trimmed]);
    setInput('');
  }

  function handleRemove(index: number) {
    setNames((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleStart() {
    if (saving || !canStart) return;
    setSaving(true);
    for (const name of names) {
      await addGoal(name);
    }
    router.replace('/');
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.container, { paddingTop: insets.top + 48, paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>TENTODAY</Text>
          <Text style={styles.title}>What do you want{'\n'}to improve?</Text>
          <Text style={styles.subtitle}>
            Pick up to {MAX_GOALS} things.{'\n'}Just 10 minutes each, every day.
          </Text>
        </View>

        {/* Input row */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="e.g. Learn guitar"
            placeholderTextColor="#999"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleAdd}
            returnKeyType="done"
            maxLength={50}
            editable={names.length < MAX_GOALS}
          />
          <Pressable
            style={[styles.addButton, !canAdd && styles.addButtonDisabled]}
            onPress={handleAdd}
            disabled={!canAdd}>
            <Text style={styles.addButtonText}>Add</Text>
          </Pressable>
        </View>

        {/* Goal list */}
        {names.length > 0 && (
          <View style={styles.list}>
            {names.map((name, i) => (
              <View key={i} style={styles.goalRow}>
                <View style={styles.goalDot} />
                <Text style={styles.goalName}>{name}</Text>
                <Pressable onPress={() => handleRemove(i)} hitSlop={12}>
                  <Text style={styles.removeText}>✕</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {/* Slot counter */}
        {names.length > 0 && (
          <Text style={styles.counter}>
            {names.length} of {MAX_GOALS} goals added
          </Text>
        )}

        {/* Start button */}
        <Pressable
          style={[styles.startButton, !canStart && styles.startButtonDisabled]}
          onPress={handleStart}
          disabled={!canStart || saving}>
          <Text style={styles.startButtonText}>
            {saving ? 'Setting up…' : "Let's start →"}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: 28,
  },
  header: {
    marginBottom: 40,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: Colors.brand,
    marginBottom: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#11181C',
    lineHeight: 42,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 52,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#11181C',
    backgroundColor: '#FAFAFA',
  },
  addButton: {
    height: 52,
    paddingHorizontal: 20,
    backgroundColor: Colors.brand,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    opacity: 0.35,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  list: {
    gap: 4,
    marginBottom: 12,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#F6FEFF',
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#D6F5FA',
  },
  goalDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.brand,
  },
  goalName: {
    flex: 1,
    fontSize: 16,
    color: '#11181C',
  },
  removeText: {
    fontSize: 13,
    color: '#999',
  },
  counter: {
    fontSize: 13,
    color: '#999',
    marginBottom: 36,
  },
  startButton: {
    height: 58,
    backgroundColor: Colors.brand,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  startButtonDisabled: {
    opacity: 0.3,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.3,
  },
});
