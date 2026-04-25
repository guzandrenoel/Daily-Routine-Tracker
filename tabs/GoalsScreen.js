import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../styles/theme';

export default function GoalsScreen({ routines, setRoutines }) {
  const [title, setTitle] = useState('');

  const addRoutine = () => {
    const t = title.trim();
    if (!t) return;

    const newItem = { id: Date.now().toString(), title: t, done: false };
    setRoutines([newItem, ...routines]);
    setTitle('');
  };

  const toggleDone = (id) => {
    setRoutines(routines.map((r) => (r.id === id ? { ...r, done: !r.done } : r)));
  };

  const removeRoutine = (id) => {
    setRoutines(routines.filter((r) => r.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Routines</Text>
      <Text style={styles.subtext}>Add routines and mark them done.</Text>

      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          placeholder="New routine (e.g. Drink water)"
          placeholderTextColor={colors.mutedText}
          value={title}
          onChangeText={setTitle}
        />
        <Pressable style={styles.addBtn} onPress={addRoutine}>
          <Text style={styles.addText}>Add</Text>
        </Pressable>
      </View>

      <FlatList
        data={routines}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>No routines yet. Add your first one above.</Text>}
        renderItem={({ item }) => (
          <View style={[styles.card, item.done && styles.cardDone]}>
            <Pressable style={{ flex: 1 }} onPress={() => toggleDone(item.id)}>
              <Text style={[styles.cardTitle, item.done && styles.cardTitleDone]}>{item.title}</Text>
              <Text style={styles.cardMeta}>{item.done ? 'Done ✅' : 'Not done'}</Text>
            </Pressable>

            <Pressable onPress={() => removeRoutine(item.id)} style={styles.delBtn}>
              <Text style={styles.delText}>Del</Text>
            </Pressable>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 56, paddingHorizontal: 18 },
  heading: { fontSize: 28, fontWeight: '800', color: colors.textPrimary },
  subtext: { marginTop: 6, marginBottom: 14, fontSize: 14, color: colors.textSecondary },

  addRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  addBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    borderRadius: 14,
    justifyContent: 'center',
  },
  addText: { color: '#fff', fontWeight: '900' },

  empty: { textAlign: 'center', marginTop: 18, color: colors.mutedText, fontWeight: '700' },

  card: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  cardDone: { backgroundColor: colors.accentTint },
  cardTitle: { fontSize: 16, fontWeight: '900', color: colors.textPrimary },
  cardTitleDone: { textDecorationLine: 'line-through', color: colors.textSecondary },
  cardMeta: { marginTop: 6, color: colors.textSecondary, fontWeight: '700' },

  delBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  delText: { fontWeight: '900', color: colors.textPrimary },
});