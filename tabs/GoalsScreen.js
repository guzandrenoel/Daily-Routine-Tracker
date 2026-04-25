import { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../styles/theme';

export default function GoalsScreen({ routines, setRoutines }) {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [editingId, setEditingId] = useState(null);

  const completedCount = useMemo(() => routines.filter((r) => r.done).length, [routines]);

  const resetForm = () => {
    setTitle('');
    setTime('');
    setEditingId(null);
  };

  const saveRoutine = () => {
    const t = title.trim();
    const tm = time.trim();

    if (!t) return Alert.alert('Missing', 'Routine title is required.');

    if (editingId) {
      setRoutines((prev) =>
        prev.map((r) => (r.id === editingId ? { ...r, title: t, time: tm } : r))
      );
      resetForm();
      return;
    }

    const newItem = { id: String(Date.now()), title: t, time: tm, done: false };
    setRoutines((prev) => [newItem, ...prev]);
    resetForm();
  };

  const toggleDone = (id) => {
    setRoutines((prev) => prev.map((r) => (r.id === id ? { ...r, done: !r.done } : r)));
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setTitle(item.title);
    setTime(item.time ?? '');
  };

  const removeItem = (id) => {
    setRoutines((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Routines</Text>
      <Text style={styles.subtext}>
        {completedCount}/{routines.length} completed
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Routine name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Drink Water"
          placeholderTextColor={colors.mutedText}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Time (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 8:00 AM"
          placeholderTextColor={colors.mutedText}
          value={time}
          onChangeText={setTime}
        />

        <View style={styles.row}>
          <Pressable style={styles.primaryBtn} onPress={saveRoutine}>
            <Text style={styles.primaryText}>{editingId ? 'Update' : 'Add'}</Text>
          </Pressable>

          {editingId && (
            <Pressable style={styles.ghostBtn} onPress={resetForm}>
              <Text style={styles.ghostText}>Cancel</Text>
            </Pressable>
          )}
        </View>
      </View>

      <FlatList
        data={routines}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>No routines yet. Add your first one above.</Text>}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View style={[styles.item, item.done && styles.itemDone]}>
            <Pressable onPress={() => toggleDone(item.id)} style={styles.itemLeft}>
              <Text style={[styles.itemTitle, item.done && styles.itemTitleDone]}>{item.title}</Text>
              {!!item.time && <Text style={styles.itemMeta}>{item.time}</Text>}
            </Pressable>

            <View style={styles.itemActions}>
              <Pressable onPress={() => startEdit(item)} style={styles.smallBtn}>
                <Text style={styles.smallBtnText}>Edit</Text>
              </Pressable>
              <Pressable onPress={() => removeItem(item.id)} style={[styles.smallBtn, styles.dangerBtn]}>
                <Text style={[styles.smallBtnText, styles.dangerText]}>Del</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 56, paddingHorizontal: 18 },
  heading: { fontSize: 28, fontWeight: '900', color: colors.textPrimary },
  subtext: { marginTop: 4, marginBottom: 14, color: colors.textSecondary, fontWeight: '700' },

  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: colors.border, marginBottom: 14 },
  label: { fontWeight: '800', color: colors.textPrimary, marginTop: 8, marginBottom: 6 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, color: colors.textPrimary },

  row: { flexDirection: 'row', gap: 10, marginTop: 12 },
  primaryBtn: { flex: 1, backgroundColor: colors.accent, paddingVertical: 12, borderRadius: 14, alignItems: 'center' },
  primaryText: { color: '#fff', fontWeight: '900' },
  ghostBtn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 14, borderWidth: 1, borderColor: colors.border },
  ghostText: { color: colors.textPrimary, fontWeight: '900' },

  empty: { textAlign: 'center', marginTop: 24, color: colors.mutedText, fontWeight: '700' },

  item: { backgroundColor: colors.surface, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: colors.border, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  itemDone: { backgroundColor: 'rgba(24,166,160,0.08)' },
  itemLeft: { flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: '900', color: colors.textPrimary },
  itemTitleDone: { textDecorationLine: 'line-through', color: colors.textSecondary },
  itemMeta: { marginTop: 4, color: colors.textSecondary, fontWeight: '700' },

  itemActions: { flexDirection: 'row', gap: 8 },
  smallBtn: { borderWidth: 1, borderColor: colors.border, paddingVertical: 8, paddingHorizontal: 10, borderRadius: 12 },
  smallBtnText: { fontWeight: '900', color: colors.textPrimary },
  dangerBtn: { backgroundColor: 'rgba(239,68,68,0.10)', borderColor: 'rgba(239,68,68,0.25)' },
  dangerText: { color: '#ef4444' },
});