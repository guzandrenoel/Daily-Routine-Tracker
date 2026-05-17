import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { lightTheme, darkTheme } from '../styles/theme';

import { useAtom, useAtomValue } from 'jotai';
import { isDarkModeAtom, routinesStatsAtom, selectedDateAtom } from '../store/atoms';
import { useStore } from 'jotai';
import { loadCompletionsForDate } from '../store/routinesActions';

const QUOTES = [
  'Small steps every day lead to big results.',
  'Consistency beats perfection every time.',
  'Your future self is watching — make them proud.',
  "Progress, not perfection. You've got this.",
  'One routine at a time. Keep showing up.',
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning!';
  if (h < 17) return 'Good afternoon!';
  return 'Good evening!';
}

function formatFullDate(date) {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function get5DayStrip(centerDate) {
  const days = [];
  for (let offset = -2; offset <= 2; offset++) {
    const d = new Date(centerDate);
    d.setDate(centerDate.getDate() + offset);
    days.push(d);
  }
  return days;
}

// ── Theme pill: yellow sun in light mode, purple/indigo moon in dark mode ──
function ThemePill({ isDarkMode, onToggle, colors: c }) {
  const thumbColor = isDarkMode ? '#7C6FF7' : '#F5A623';
  const trackColor = isDarkMode
    ? 'rgba(124,111,247,0.18)'
    : 'rgba(245,166,35,0.18)';
  const borderColor = isDarkMode
    ? 'rgba(124,111,247,0.45)'
    : 'rgba(245,166,35,0.55)';

  return (
    <Pressable
      onPress={onToggle}
      style={[
        styles.pill,
        { backgroundColor: trackColor, borderColor },
      ]}
    >
      <View
        style={[
          styles.pillThumb,
          {
            backgroundColor: thumbColor,
            transform: [{ translateX: isDarkMode ? 26 : 0 }],
          },
        ]}
      >
        <MaterialCommunityIcons
          name={isDarkMode ? 'weather-night' : 'white-balance-sunny'}
          size={16}
          color="#fff"
        />
      </View>
    </Pressable>
  );
}

export default function HomeScreen({ onToggleTheme }) {
  const isDarkMode = useAtomValue(isDarkModeAtom);
  const { percent, done, remaining, total } = useAtomValue(routinesStatsAtom);
  const [selectedDate, setSelectedDateAtom] = useAtom(selectedDateAtom);
  const store = useStore();

  const c = isDarkMode ? darkTheme.colors : lightTheme.colors;

  const days = useMemo(() => get5DayStrip(selectedDate), [selectedDate]);
  const quote = useMemo(() => QUOTES[new Date().getDay() % QUOTES.length], []);

  async function handleDateSelect(date) {
    setSelectedDateAtom(date);
    try {
      await loadCompletionsForDate(store.get, store.set, date);
    } catch (e) {
      // silently fail
    }
  }

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  // ring math
  const size = 110;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(percent, 100));
  const dashOffset = circumference - (circumference * clamped) / 100;

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.heading, { color: c.textPrimary }]}>{getGreeting()}</Text>
          <Text style={[styles.subtext, { color: c.textSecondary }]}>
            {formatFullDate(selectedDate)}
          </Text>
        </View>
        <ThemePill isDarkMode={isDarkMode} onToggle={onToggleTheme} colors={c} />
      </View>

      {/* Motivational quote */}
      <View style={[styles.quoteCard, { backgroundColor: c.accentTint, borderColor: c.accent }]}>
        <MaterialCommunityIcons name="format-quote-open" size={16} color={c.accent} />
        <Text style={[styles.quoteText, { color: c.accent }]}>{quote}</Text>
      </View>

      {/* Calendar strip */}
      <View style={[styles.calendarWrap, { backgroundColor: c.surface, borderColor: c.border }]}>
        {days.map((d) => {
          const isSelected = d.toDateString() === selectedDate.toDateString();
          const dow = d.toLocaleDateString(undefined, { weekday: 'short' });
          const dayNum = d.getDate();

          return (
            <Pressable
              key={d.toISOString()}
              onPress={() => handleDateSelect(d)}
              style={[
                styles.dayChip,
                { borderColor: c.border, backgroundColor: c.surface },
                isSelected && { backgroundColor: c.accent, borderColor: c.accent },
              ]}
            >
              <Text style={[styles.dayDow, { color: c.textSecondary }, isSelected && { color: '#fff' }]}>
                {dow}
              </Text>
              <Text style={[styles.dayNum, { color: c.textPrimary }, isSelected && { color: '#fff' }]}>
                {dayNum}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Progress card */}
      <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
        <View style={styles.cardTitleRow}>
          <Text style={[styles.cardTitle, { color: c.textPrimary }]}>
            {isToday ? "Today's Progress" : formatFullDate(selectedDate)}
          </Text>
          {!isToday && (
            <Pressable onPress={() => handleDateSelect(new Date())}>
              <Text style={[styles.backToToday, { color: c.accent }]}>Back to today</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.progressRow}>
          <View style={styles.ringWrap}>
            <Svg width={size} height={size}>
              <Circle cx={cx} cy={cy} r={r} stroke={c.border} strokeWidth={stroke} fill="transparent" />
              <Circle
                cx={cx} cy={cy} r={r}
                stroke={c.accent}
                strokeWidth={stroke}
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={dashOffset}
                rotation="-90"
                originX={cx}
                originY={cy}
              />
            </Svg>
            <View style={[styles.ringCenter, { backgroundColor: c.surface }]}>
              <Text style={[styles.ringPct, { color: c.textPrimary }]}>{percent}%</Text>
              <Text style={[styles.ringSub, { color: c.textSecondary }]}>Done</Text>
            </View>
          </View>

          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={[styles.bigRight, { color: c.accent }]}>{percent}%</Text>
            <Text style={[styles.meta, { color: c.textSecondary }]}>{done} completed</Text>
            <Text style={[styles.meta, { color: c.textSecondary }]}>{remaining} remaining</Text>
            <Text style={[styles.meta, { color: c.mutedText }]}>{total} total</Text>
          </View>
        </View>

        {/* Linear bar */}
        <View style={[styles.barTrack, { backgroundColor: c.border }]}>
          <View style={[styles.barFill, { width: `${percent}%`, backgroundColor: c.accent }]} />
        </View>
        <Text style={[styles.barLabel, { color: c.mutedText }]}>
          {percent === 100 ? '🎉 All done!' : `${100 - percent}% left to complete`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 56, paddingHorizontal: 18 },

  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  heading: { fontSize: 28, fontWeight: '900' },
  subtext: { marginTop: 4, fontSize: 13, fontWeight: '600' },

  pill: {
    width: 58, height: 32, borderRadius: 16,
    borderWidth: 1.5, padding: 3, justifyContent: 'center',
  },
  pillThumb: {
    width: 26, height: 26, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
  },

  quoteCard: {
    marginTop: 14, flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    borderWidth: 1, borderRadius: 14, paddingVertical: 10, paddingHorizontal: 12,
  },
  quoteText: { flex: 1, fontWeight: '700', fontSize: 13, lineHeight: 19 },

  calendarWrap: {
    marginTop: 14, padding: 12, borderRadius: 18, borderWidth: 1,
    flexDirection: 'row', justifyContent: 'space-between',
  },
  dayChip: {
    width: 56, height: 56, borderRadius: 28, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  dayDow: { fontSize: 12, fontWeight: '700' },
  dayNum: { marginTop: 2, fontSize: 18, fontWeight: '900' },

  card: { marginTop: 14, borderRadius: 18, padding: 16, borderWidth: 1 },
  cardTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 17, fontWeight: '900', flex: 1 },
  backToToday: { fontSize: 12, fontWeight: '800' },

  progressRow: { flexDirection: 'row', marginTop: 14, alignItems: 'center' },
  ringWrap: { width: 110, height: 110, alignItems: 'center', justifyContent: 'center' },
  ringCenter: {
    position: 'absolute', width: 86, height: 86, borderRadius: 43,
    alignItems: 'center', justifyContent: 'center',
  },
  ringPct: { fontSize: 20, fontWeight: '900' },
  ringSub: { marginTop: 2, fontSize: 12, fontWeight: '700' },

  bigRight: { fontSize: 42, fontWeight: '900' },
  meta: { marginTop: 5, fontSize: 13, fontWeight: '700' },

  barTrack: { marginTop: 14, height: 7, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4, minWidth: 4 },
  barLabel: { marginTop: 6, fontSize: 12, fontWeight: '700' },
});