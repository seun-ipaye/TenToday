import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useGoals } from '@/context/goals';
import { Colors } from '@/constants/theme';
import { computeStreak } from '@/store/goals';

const MESSAGES = [
  'Keep showing up. That\'s all it takes.',
  'Consistency beats intensity every time.',
  'Small steps, every day. It adds up.',
  'You did it. See you tomorrow.',
  'Ten minutes today. Ten minutes tomorrow.',
];

function pickMessage(goalId: string): string {
  // Deterministic pick based on goalId so it doesn't change on re-render
  const index = goalId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return MESSAGES[index % MESSAGES.length];
}

export default function CompleteScreen() {
  const { goalId } = useLocalSearchParams<{ goalId: string }>();
  const { goals } = useGoals();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const goal = goals.find((g) => g.id === goalId);
  const streak = goal ? computeStreak(goal.completedDates) : 0;

  return (
    <View
      style={[
        styles.screen,
        { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 },
      ]}>
      {/* Celebration */}
      <View style={styles.body}>
        <View style={styles.iconWrap}>
          <Ionicons name="checkmark-circle" size={80} color={Colors.brand} />
        </View>

        <Text style={styles.title}>Session complete!</Text>

        {goal && <Text style={styles.goalName}>{goal.name}</Text>}

        {streak > 0 && (
          <View style={styles.streakBadge}>
            <Text style={styles.streakNumber}>{streak}</Text>
            <Text style={styles.streakLabel}>
              {streak === 1 ? 'day streak' : 'day streak'}
            </Text>
          </View>
        )}

        <Text style={styles.message}>{goalId ? pickMessage(goalId) : ''}</Text>
      </View>

      {/* Action */}
      <View style={styles.footer}>
        <Pressable style={styles.homeButton} onPress={() => router.replace('/')}>
          <Text style={styles.homeButtonText}>Back to Goals</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  iconWrap: {
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#11181C',
    textAlign: 'center',
  },
  goalName: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    backgroundColor: '#F0FFFE',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.brand,
    marginVertical: 8,
  },
  streakNumber: {
    fontSize: 40,
    fontWeight: '800',
    color: Colors.brand,
  },
  streakLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.brand,
  },
  message: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 8,
  },
  footer: {
    paddingHorizontal: 28,
  },
  homeButton: {
    height: 58,
    backgroundColor: Colors.brand,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
});
