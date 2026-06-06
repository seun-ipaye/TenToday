import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';

const NOTIF_ENABLED_KEY = 'tentoday_notif_enabled';
const NOTIF_HOUR_KEY = 'tentoday_notif_hour';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function scheduleDaily(hour: number) {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Time for your 10 minutes',
      body: 'Your goals are waiting. Just 10 minutes.',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute: 0,
    },
  });
}

function formatHour(hour: number): string {
  const period = hour < 12 ? 'AM' : 'PM';
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return `${h}:00 ${period}`;
}

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [enabled, setEnabled] = useState(false);
  const [hour, setHour] = useState(9);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const [storedEnabled, storedHour] = await Promise.all([
        AsyncStorage.getItem(NOTIF_ENABLED_KEY),
        AsyncStorage.getItem(NOTIF_HOUR_KEY),
      ]);
      if (storedEnabled !== null) setEnabled(storedEnabled === 'true');
      if (storedHour !== null) setHour(Number(storedHour));
      setLoaded(true);
    })();
  }, []);

  async function handleToggle(value: boolean) {
    if (value) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission needed',
          'Enable notifications in Settings to receive daily reminders.',
        );
        return;
      }
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Daily reminders',
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
      await scheduleDaily(hour);
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
    setEnabled(value);
    await AsyncStorage.setItem(NOTIF_ENABLED_KEY, String(value));
  }

  async function changeHour(delta: number) {
    const next = (hour + delta + 24) % 24;
    setHour(next);
    await AsyncStorage.setItem(NOTIF_HOUR_KEY, String(next));
    if (enabled) await scheduleDaily(next);
  }

  if (!loaded) return null;

  return (
    <View style={[styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#11181C" />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.body}>
        {/* Notifications section */}
        <Text style={styles.sectionLabel}>NOTIFICATIONS</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <View>
              <Text style={styles.rowTitle}>Daily reminder</Text>
              <Text style={styles.rowSub}>Get nudged to complete your goals</Text>
            </View>
            <Switch
              value={enabled}
              onValueChange={handleToggle}
              trackColor={{ false: '#E0E0E0', true: Colors.brand }}
              thumbColor="#fff"
            />
          </View>

          {enabled && (
            <>
              <View style={styles.divider} />
              <View style={styles.row}>
                <Text style={styles.rowTitle}>Reminder time</Text>
                <View style={styles.hourPicker}>
                  <Pressable onPress={() => changeHour(-1)} hitSlop={12}>
                    <Ionicons name="chevron-back" size={20} color={Colors.brand} />
                  </Pressable>
                  <Text style={styles.hourText}>{formatHour(hour)}</Text>
                  <Pressable onPress={() => changeHour(1)} hitSlop={12}>
                    <Ionicons name="chevron-forward" size={20} color={Colors.brand} />
                  </Pressable>
                </View>
              </View>
            </>
          )}
        </View>

        {/* About section */}
        <Text style={[styles.sectionLabel, { marginTop: 28 }]}>ABOUT</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowTitle}>TenToday</Text>
            <Text style={styles.rowSub}>v1.0.0</Text>
          </View>
        </View>
      </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#F5F5F7',
  },
  backButton: {
    width: 36,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#11181C',
  },
  headerRight: {
    width: 36,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#999',
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowTitle: {
    fontSize: 16,
    color: '#11181C',
  },
  rowSub: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E8E8E8',
    marginHorizontal: 16,
  },
  hourPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hourText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.brand,
    minWidth: 72,
    textAlign: 'center',
  },
});
