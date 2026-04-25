import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { colors } from "../styles/theme";

/* ---------- Helpers ---------- */
function formatFullDate(date) {
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getMiniDays(centerDate, count = 5) {
  // returns e.g. Thu Fri Sat Sun Mon around the selected date
  // count should be odd, like 5
  const half = Math.floor(count / 2);
  const days = [];
  for (let i = -half; i <= half; i++) {
    const d = new Date(centerDate);
    d.setDate(centerDate.getDate() + i);
    days.push(d);
  }
  return days;
}

/* ---------- Progress Ring ---------- */
function ProgressRing({ percent, size = 130, stroke = 14 }) {
  const clamped = Math.max(0, Math.min(percent, 100));
  const radius = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (circumference * clamped) / 100;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={colors.border}
          strokeWidth={stroke}
          fill="none"
          opacity={0.25}
        />
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={colors.accent}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashOffset}
          originX={cx}
          originY={cy}
          rotation={-90}
        />
      </Svg>

      <View style={styles.ringCenter}>
        <Text style={styles.ringPercent}>{`${Math.round(clamped)}%`}</Text>
        <Text style={styles.ringLabel}>Completed</Text>
      </View>
    </View>
  );
}

/* ---------- Home Screen ---------- */
export default function HomeScreen({ user, routines = [] }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const total = routines.length;
  const done = routines.filter((r) => r.done).length;

  // ✅ if total is 0, ring is EMPTY
  const percent = total === 0 ? 0 : (done / total) * 100;

  const miniDays = useMemo(() => getMiniDays(selectedDate, 5), [selectedDate]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Good morning, {user?.username || "User"}!</Text>
      <Text style={styles.subtext}>{formatFullDate(selectedDate)}</Text>

      {/* Mini Calendar Strip */}
      <View style={styles.calendarCard}>
        {miniDays.map((d) => {
          const isSelected =
            d.toDateString() === selectedDate.toDateString();

          return (
            <Pressable
              key={d.toISOString()}
              onPress={() => setSelectedDate(d)}
              style={[styles.dayPill, isSelected && styles.dayPillSelected]}
            >
              <Text style={[styles.dayName, isSelected && styles.dayNameSelected]}>
                {d.toLocaleDateString(undefined, { weekday: "short" })}
              </Text>
              <Text style={[styles.dayNum, isSelected && styles.dayNumSelected]}>
                {d.getDate()}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Progress Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Progress</Text>

        <View style={styles.progressRow}>
          <ProgressRing percent={percent} />

          <View style={styles.rightCol}>
            <Text style={styles.statNumber}>{done}</Text>
            <Text style={styles.statLabel}>Completed</Text>

            <View style={{ height: 14 }} />

            <Text style={styles.statNumber}>{Math.max(total - done, 0)}</Text>
            <Text style={styles.statLabel}>Remaining</Text>
          </View>
        </View>

        {total === 0 && (
          <Text style={styles.emptyHint}>
            No routines yet.
          </Text>
        )}
      </View>
    </View>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 56,
    paddingHorizontal: 18,
  },

  heading: { fontSize: 28, fontWeight: "900", color: colors.textPrimary },
  subtext: { marginTop: 6, color: colors.textSecondary, fontWeight: "700" },

  calendarCard: {
    marginTop: 16,
    backgroundColor: colors.surface,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  dayPill: {
    width: 58,
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.03)",
  },
  dayPillSelected: {
    backgroundColor: colors.accent,
  },
  dayName: { fontSize: 12, fontWeight: "800", color: colors.textSecondary },
  dayNameSelected: { color: "#fff" },
  dayNum: { marginTop: 6, fontSize: 16, fontWeight: "900", color: colors.textPrimary },
  dayNumSelected: { color: "#fff" },

  card: {
    marginTop: 18,
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { fontWeight: "900", color: colors.textPrimary, fontSize: 18 },

  progressRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  ringCenter: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  ringPercent: { fontSize: 26, fontWeight: "900", color: colors.textPrimary },
  ringLabel: { marginTop: 2, fontSize: 12, fontWeight: "700", color: colors.textSecondary },

  rightCol: { alignItems: "flex-start" },
  statNumber: { fontSize: 26, fontWeight: "900", color: colors.textPrimary },
  statLabel: { fontSize: 14, fontWeight: "700", color: colors.textSecondary },

  emptyHint: { marginTop: 14, color: colors.textSecondary, fontWeight: "700" },
});