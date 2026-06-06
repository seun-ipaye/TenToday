import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useGoals } from '@/context/goals';
import { Colors } from '@/constants/theme';
import { savePartialProgress, todayKey } from '@/store/goals';

const DURATION = 10 * 60; // 600 seconds

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function SessionScreen() {
  const { goalId } = useLocalSearchParams<{ goalId: string }>();
  const { goals, completeSession, savePartialProgress: savePartial, refresh } = useGoals();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const goal = goals.find((g) => g.id === goalId);

  // Resume from wherever the user left off today
  const today = todayKey();
  const existingPartial = goal?.partialDate === today ? (goal?.partialSeconds ?? 0) : 0;
  const initialRemaining = DURATION - existingPartial;

  const [remaining, setRemaining] = useState(initialRemaining);
  const [running, setRunning] = useState(true);

  const doneRef = useRef(false);
  const savedRef = useRef(false);
  const remainingRef = useRef(initialRemaining);
  const initialRemainingRef = useRef(initialRemaining);

  // Keep ref in sync so cancel handler and cleanup always have the latest value
  useEffect(() => {
    remainingRef.current = remaining;
  }, [remaining]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (remaining === 0 && !doneRef.current) {
      doneRef.current = true;
      finish();
    }
  }, [remaining]);

  // Fallback for Android hardware back — best-effort, context won't update until useFocusEffect on home
  useEffect(() => {
    return () => {
      if (!doneRef.current && !savedRef.current && goalId) {
        const elapsed = initialRemainingRef.current - remainingRef.current;
        if (elapsed > 0) savePartialProgress(goalId, elapsed);
      }
    };
  }, [goalId]);

  async function finish() {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (goalId) await completeSession(goalId);
    router.replace(`/complete/${goalId}`);
  }

  async function handleCancel() {
    setRunning(false);
    const elapsed = initialRemainingRef.current - remainingRef.current;
    if (!doneRef.current && !savedRef.current && elapsed > 0 && goalId) {
      savedRef.current = true;
      // Await both so context is updated before home screen renders
      await savePartial(goalId, elapsed);
    }
    router.back();
  }

  const progress = (DURATION - remaining) / DURATION;
  const progressPercent = `${Math.round(progress * 100)}%` as `${number}%`;

  return (
    <View style={[styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={handleCancel} hitSlop={16} style={styles.cancelButton}>
          <Ionicons name="close" size={20} color="#888" />
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      </View>

      {/* Center content */}
      <View style={styles.center}>
        <Text style={styles.goalName} numberOfLines={2}>
          {goal?.name ?? ''}
        </Text>
        <Text style={styles.label}>Focus session</Text>

        <Text style={styles.timer}>{formatTime(remaining)}</Text>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: progressPercent }]} />
        </View>
        <Text style={styles.progressLabel}>
          {Math.round(progress * 100)}% complete
        </Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <Pressable
          style={styles.pauseButton}
          onPress={() => setRunning((r) => !r)}>
          <Ionicons name={running ? 'pause' : 'play'} size={28} color="#fff" />
          <Text style={styles.pauseButtonText}>
            {running ? 'Pause' : 'Resume'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  cancelText: {
    fontSize: 15,
    color: '#888',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 10,
  },
  goalName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#11181C',
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: '#aaa',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  timer: {
    fontSize: 88,
    fontWeight: '800',
    color: Colors.brand,
    letterSpacing: -2,
    lineHeight: 96,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 24,
  },
  progressFill: {
    height: 6,
    backgroundColor: Colors.brand,
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 13,
    color: '#bbb',
  },
  controls: {
    paddingHorizontal: 32,
    paddingBottom: 16,
  },
  pauseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.brand,
    height: 58,
    borderRadius: 16,
  },
  pauseButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
});
