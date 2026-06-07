import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useGoals } from '@/context/goals';

const MAX_GOALS = 5;

export default function AddGoalScreen() {
  const { goals, addGoal } = useGoals();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [input, setInput] = useState('');
  const [saving, setSaving] = useState(false);

  const atLimit = goals.length >= MAX_GOALS;
  const canSave = input.trim().length > 0 && !atLimit && !saving;

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    await addGoal(input.trim());
    router.back();
  }

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.cancelButton}>
          <Ionicons name="close" size={24} color="#11181C" />
        </Pressable>
        <Text style={styles.headerTitle}>New Goal</Text>
        <Pressable
          onPress={handleSave}
          disabled={!canSave}
          hitSlop={12}
          style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}>
          <Text style={[styles.saveButtonText, !canSave && styles.saveButtonTextDisabled]}>
            Save
          </Text>
        </Pressable>
      </View>

      <View style={styles.body}>
        {atLimit ? (
          <View style={styles.limitBox}>
            <Ionicons name="checkmark-circle" size={40} color={Colors.brand} />
            <Text style={styles.limitTitle}>You're all set!</Text>
            <Text style={styles.limitSub}>
              You already have {MAX_GOALS} goals. Remove one before adding a new one.
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.label}>What do you want to improve?</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Read more books"
              placeholderTextColor="#999"
              value={input}
              onChangeText={setInput}
              onSubmitEditing={handleSave}
              returnKeyType="done"
              maxLength={50}
              autoFocus
            />
            <Text style={styles.hint}>
              {goals.length} of {MAX_GOALS} goals used
            </Text>

            <Pressable
              style={[styles.saveMainButton, !canSave && styles.saveMainButtonDisabled]}
              onPress={handleSave}
              disabled={!canSave}>
              <Text style={styles.saveMainButtonText}>
                {saving ? 'Adding…' : 'Add Goal'}
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8E8E8',
  },
  cancelButton: {
    width: 44,
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#11181C',
  },
  saveButton: {
    width: 44,
    alignItems: 'flex-end',
  },
  saveButtonDisabled: {
    opacity: 0.35,
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.brand,
  },
  saveButtonTextDisabled: {
    color: '#999',
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  label: {
    fontSize: 22,
    fontWeight: '800',
    color: '#11181C',
    marginBottom: 20,
  },
  input: {
    height: 56,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 14,
    paddingHorizontal: 18,
    fontSize: 17,
    color: '#11181C',
    backgroundColor: '#FAFAFA',
  },
  hint: {
    fontSize: 13,
    color: '#aaa',
    marginTop: 10,
    marginLeft: 2,
  },
  saveMainButton: {
    height: 56,
    backgroundColor: Colors.brand,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  saveMainButtonDisabled: {
    opacity: 0.35,
  },
  saveMainButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  limitBox: {
    alignItems: 'center',
    paddingTop: 48,
    gap: 12,
  },
  limitTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#11181C',
  },
  limitSub: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
});
