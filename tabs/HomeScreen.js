import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { lightTheme, darkTheme } from '../styles/theme';

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

function ThemePill({ isDarkMode, onToggle, colors: c }) {
  return (
    <Pressable
      onPress={onToggle}
      style={[
        styles.pill,
        {
          backgroundColor: c.surface,
          borderColor: c.border,
        },
      ]}
    >
      <View
        style={[
          styles.pillThumb,
          {
            backgroundColor: c.accent,
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

export default function HomeScreen({routines = [], isDarkMode, onToggleTheme }) {
  const c = isDarkMode ? darkTheme.colors : lightTheme.colors;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const days = useMemo(() => get5DayStrip(selectedDate), [selectedDate]);

  const total = routines.length;
  const done = routines.filter((r) => r.done).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.heading, { color: c.textPrimary }]}>
            Good day!
          </Text>
          <Text style={[styles.subtext, { color: c.textSecondary }]}>
            {formatFullDate(selectedDate)}
          </Text>
        </View>

        {/* ✅ pill toggle */}
        <ThemePill isDarkMode={isDarkMode} onToggle={onToggleTheme} colors={c} />
      </View>

      <View style={[styles.calendarWrap, { backgroundColor: c.surface, borderColor: c.border }]}>
        {days.map((d) => {
          const isSelected = d.toDateString() === selectedDate.toDateString();
          const dow = d.toLocaleDateString(undefined, { weekday: 'short' });
          const dayNum = d.getDate();

          return (
            <Pressable
              key={d.toISOString()}
              onPress={() => setSelectedDate(d)}
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

      <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
        <Text style={[styles.cardTitle, { color: c.textPrimary }]}>Today's Progress</Text>

        <View style={styles.progressRow}>
          <View style={[styles.ringOuter, { borderColor: c.border }]}>
            <View style={[styles.ringInner, { backgroundColor: c.surface }]}>
              <Text style={[styles.ringPct, { color: c.textPrimary }]}>{percent}%</Text>
              <Text style={[styles.ringSub, { color: c.textSecondary }]}>Completed</Text>
            </View>
          </View>

          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={[styles.bigRight, { color: c.accent }]}>{percent}%</Text>

            {total === 0 ? (
              <>
                <Text style={[styles.meta, { color: c.textSecondary }]}>0 completed</Text>
                <Text style={[styles.meta, { color: c.textSecondary }]}>0 remaining</Text>
              </>
            ) : (
              <>
                <Text style={[styles.meta, { color: c.textSecondary }]}>{done} completed</Text>
                <Text style={[styles.meta, { color: c.textSecondary }]}>{Math.max(total - done, 0)} remaining</Text>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 56, paddingHorizontal: 18 },

  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  heading: { fontSize: 28, fontWeight: '800' },
  subtext: { marginTop: 6, fontSize: 14, fontWeight: '600' },

  // ✅ pill toggle styles
  pill: {
    width: 58,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    padding: 3,
    justifyContent: 'center',
  },
  pillThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  calendarWrap: {
    marginTop: 16,
    padding: 12,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayChip: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayDow: { fontSize: 12, fontWeight: '700' },
  dayNum: { marginTop: 2, fontSize: 18, fontWeight: '900' },

  card: { marginTop: 16, borderRadius: 18, padding: 16, borderWidth: 1 },
  cardTitle: { fontSize: 20, fontWeight: '900' },

  progressRow: { flexDirection: 'row', marginTop: 14, alignItems: 'center' },

  ringOuter: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringInner: {
    width: 86,
    height: 86,
    borderRadius: 43,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringPct: { fontSize: 20, fontWeight: '900' },
  ringSub: { marginTop: 2, fontSize: 12, fontWeight: '700' },

  bigRight: { fontSize: 42, fontWeight: '900' },
  meta: { marginTop: 6, fontSize: 14, fontWeight: '700' },
});