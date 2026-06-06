import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useGoals } from '@/context/goals';
import { Colors } from '@/constants/theme';
import { computeStreak, hasCompletedToday } from '@/store/goals';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const { goals, loading } = useGoals();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  if (loading) return null;

  const doneCount = goals.filter(hasCompletedToday).length;
  const allDone = goals.length > 0 && doneCount === goals.length;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.progress}>
            {allDone ? 'All done for today!' : `${doneCount} of ${goals.length} done today`}
          </Text>
        </View>
        <Pressable
          onPress={() => router.push('/settings')}
          hitSlop={12}
          style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#999" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}>

        {goals.map((goal) => {
          const done = hasCompletedToday(goal);
          const streak = computeStreak(goal.completedDates);

          return (
            <View key={goal.id} style={[styles.card, done && styles.cardDone]}>
              <View style={[styles.accent, done && styles.accentDone]} />

              <View style={styles.cardContent}>
                <View style={styles.cardTop}>
                  <Text style={[styles.goalName, done && styles.goalNameDone]} numberOfLines={1}>
                    {goal.name}
                  </Text>
                  {done && (
                    <View style={styles.doneChip}>
                      <Ionicons name="checkmark" size={13} color="#22C55E" />
                      <Text style={styles.doneChipText}>Done</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.streakText}>
                  {streak > 0 ? `${streak}-day streak` : 'Start your streak today'}
                </Text>

                {!done && (
                  <Pressable
                    style={styles.startButton}
                    onPress={() => router.push(`/session/${goal.id}`)}>
                    <Ionicons name="timer-outline" size={16} color="#fff" />
                    <Text style={styles.startButtonText}>Start 10 min</Text>
                  </Pressable>
                )}
              </View>
            </View>
          );
        })}

        {allDone && (
          <View style={styles.allDoneBanner}>
            <Ionicons name="star" size={28} color={Colors.brand} />
            <Text style={styles.allDoneTitle}>You showed up today.</Text>
            <Text style={styles.allDoneSub}>
              Come back tomorrow to keep your streaks alive.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: '#11181C',
  },
  progress: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  settingsButton: {
    marginTop: 6,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardDone: {
    opacity: 0.75,
  },
  accent: {
    width: 4,
    backgroundColor: Colors.brand,
  },
  accentDone: {
    backgroundColor: '#22C55E',
  },
  cardContent: {
    flex: 1,
    padding: 18,
    gap: 6,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  goalName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#11181C',
    flex: 1,
  },
  goalNameDone: {
    color: '#888',
  },
  doneChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    marginLeft: 8,
  },
  doneChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#22C55E',
  },
  streakText: {
    fontSize: 13,
    color: '#aaa',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: Colors.brand,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 6,
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  allDoneBanner: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  allDoneTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#11181C',
  },
  allDoneSub: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});
