import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { darkTheme, lightTheme } from '../styles/theme';

const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function getWeekDates() {
  const today = new Date();
  const dayOffset = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - dayOffset);
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 15 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index - 4);
    return date;
  });
}

function createStyles(colors, darkModeEnabled) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      paddingHorizontal: 22,
      paddingTop: 20,
      paddingBottom: 30,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 6,
      marginBottom: 18,
    },
    headerSpacer: {
      flex: 1,
    },
    greetingBlock: {
      marginBottom: 18,
    },
    greetingTitle: {
      fontSize: 24,
      lineHeight: 31,
      fontWeight: '800',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    greetingSubtitle: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 18,
      marginBottom: 14,
      shadowColor: '#000',
      shadowOpacity: darkModeEnabled ? 0.14 : 0.05,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
      elevation: darkModeEnabled ? 1 : 3,
      borderWidth: darkModeEnabled ? 1 : 0,
      borderColor: colors.border,
    },
    weekRail: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingRight: 4,
    },
    weekCell: {
      alignItems: 'center',
      width: 56,
    },
    weekdayLabel: {
      fontSize: 12,
      color: colors.mutedText,
      marginBottom: 8,
      fontWeight: '700',
    },
    weekdayLabelActive: {
      color: colors.accent,
    },
    dateCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: darkModeEnabled ? '#1D2632' : '#FBF7F2',
      overflow: 'hidden',
    },
    dateCircleActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    dateNumber: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    dateNumberActive: {
      color: '#FFFFFF',
    },
    todayBadge: {
      position: 'absolute',
      bottom: 3,
      fontSize: 7,
      fontWeight: '800',
      color: colors.accent,
      textTransform: 'uppercase',
    },
    cardTitle: {
      fontSize: 17,
      fontWeight: '800',
      color: colors.textPrimary,
      marginBottom: 14,
    },
    progressRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    progressRingWrap: {
      width: 138,
      alignItems: 'center',
      justifyContent: 'center',
    },
    progressRing: {
      width: 112,
      height: 112,
      borderRadius: 56,
      borderWidth: 8,
      borderColor: colors.accentTint,
      alignItems: 'center',
      justifyContent: 'center',
      borderTopColor: colors.accent,
      borderRightColor: colors.accent,
      transform: [{ rotate: '35deg' }],
    },
    progressRingInner: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      transform: [{ rotate: '-35deg' }],
    },
    emptyValue: {
      fontSize: 26,
      fontWeight: '800',
      color: colors.textPrimary,
      lineHeight: 28,
    },
    emptyLabel: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 2,
    },
    progressStats: {
      flex: 1,
      paddingLeft: 12,
      gap: 18,
    },
    progressStatBlock: {
      minHeight: 52,
      justifyContent: 'center',
    },
    statValue: {
      fontSize: 28,
      fontWeight: '800',
      color: colors.textPrimary,
      lineHeight: 32,
    },
    statLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 2,
    },
    themeSwitch: {
      width: 66,
      height: 36,
      borderRadius: 18,
      padding: 4,
      backgroundColor: darkModeEnabled ? 'rgba(115, 169, 255, 0.14)' : 'rgba(24, 166, 160, 0.12)',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    themeSwitchTrack: {
      flex: 1,
      borderRadius: 14,
      backgroundColor: darkModeEnabled ? '#111A26' : '#EAF7F6',
      justifyContent: 'center',
    },
    themeSwitchThumb: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.18,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
      elevation: 4,
    },
    themeSwitchThumbDark: {
      backgroundColor: '#DEE7F3',
    },
  });
}

export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [isDarkModePreview, setIsDarkModePreview] = useState(false);
  const switchProgress = useRef(new Animated.Value(0)).current;

  const theme = isDarkModePreview ? darkTheme.colors : lightTheme.colors;
  const styles = useMemo(() => createStyles(theme, isDarkModePreview), [theme, isDarkModePreview]);
  const weekDates = useMemo(() => getWeekDates(), []);
  const today = useMemo(() => new Date(), []);

  useEffect(() => {
    Animated.timing(switchProgress, {
      toValue: isDarkModePreview ? 1 : 0,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [isDarkModePreview, switchProgress]);

  const thumbTranslateX = switchProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 30],
  });

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <View style={styles.headerSpacer} />
        <Pressable
          onPress={() => setIsDarkModePreview((currentValue) => !currentValue)}
          style={styles.themeSwitch}
          accessibilityRole="switch"
          accessibilityState={{ checked: isDarkModePreview }}
        >
          <View style={styles.themeSwitchTrack}>
            <Animated.View
              style={[
                styles.themeSwitchThumb,
                isDarkModePreview && styles.themeSwitchThumbDark,
                {
                  transform: [{ translateX: thumbTranslateX }],
                },
              ]}
            >
              <MaterialCommunityIcons
                name={isDarkModePreview ? 'moon-waning-crescent' : 'white-balance-sunny'}
                size={19}
                color={isDarkModePreview ? '#08111F' : theme.accent}
              />
            </Animated.View>
          </View>
        </Pressable>
      </View>

      <View style={styles.greetingBlock}>
        <Text style={styles.greetingTitle}>Good morning!</Text>
        <Text style={styles.greetingSubtitle}>{formatDate(selectedDate)}</Text>
      </View>

      <View style={styles.card}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weekRail}>
          {weekDates.map((date, index) => {
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const isToday = date.toDateString() === today.toDateString();

            return (
              <Pressable key={`${weekdayLabels[index]}-${date.getDate()}`} onPress={() => setSelectedDate(date)} style={styles.weekCell}>
                <Text style={[styles.weekdayLabel, isSelected && styles.weekdayLabelActive]}>
                  {weekdayLabels[date.getDay() === 0 ? 6 : date.getDay() - 1]}
                </Text>
                <View style={[styles.dateCircle, isSelected && styles.dateCircleActive]}>
                  <Text style={[styles.dateNumber, isSelected && styles.dateNumberActive]}>{date.getDate()}</Text>
                  {isToday && <Text style={styles.todayBadge}>Today</Text>}
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today&apos;s Progress</Text>
        <View style={styles.progressRow}>
          <View style={styles.progressRingWrap}>
            <View style={styles.progressRing}>
              <View style={styles.progressRingInner}>
                <Text style={styles.emptyValue}>—</Text>
                <Text style={styles.emptyLabel}>Completed</Text>
              </View>
            </View>
          </View>

          <View style={styles.progressStats}>
            <View style={styles.progressStatBlock}>
              <Text style={styles.statValue}>—</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.progressStatBlock}>
              <Text style={styles.statValue}>—</Text>
              <Text style={styles.statLabel}>Remaining</Text>
            </View>
          </View>
        </View>
      </View>

    </ScrollView>
  );
}
