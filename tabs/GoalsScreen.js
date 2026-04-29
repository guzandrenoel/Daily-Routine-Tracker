import { useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../styles/theme';

export default function GoalsScreen({ routines, loading, onRefresh, onAdd, onToggle, onDelete }) {
  const [title, setTitle] = useState('');

  function handleAdd() {
    const t = title.trim();
    if (!t) {
      Alert.alert('Missing', 'Type a routine name first.');
      return;
    }
    onAdd(t);
    setTitle('');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Routines</Text>
      <Text style={styles.subtext}>Add routines and mark them done.</Text>

      <View style={styles.row}>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="New routine (e.g. Drink water)"
          placeholderTextColor={colors.mutedText}
          style={styles.input}
        />
        <Pressable style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addText}>Add</Text>
        </Pressable>
      </View>

      <Pressable style={styles.refreshBtn} onPress={onRefresh}>
        <Text style={styles.refreshText}>{loading ? 'Loading...' : 'Refresh from Supabase'}</Text>
      </Pressable>

      <FlatList
        data={routines}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 40 }}
        ListEmptyComponent={<Text style={styles.empty}>No routines yet. Add your first one 👆</Text>}
        renderItem={({ item }) => {
          const done = !!item.done;
          return (
            <Pressable
              onPress={() => onToggle(item.id, !done)}
              style={[styles.card, done && styles.cardDone]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.title, done && styles.titleDone]}>{item.title}</Text>
                <Text style={styles.status}>{done ? 'Done ✅' : 'Not done'}</Text>
              </View>

              <Pressable onPress={() => onDelete(item.id)} style={styles.deleteBtn}>
                <MaterialCommunityIcons name="close" size={18} color={colors.textPrimary} />
              </Pressable>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 56, paddingHorizontal: 18 },
  heading: { fontSize: 30, fontWeight: '900', color: colors.textPrimary },
  subtext: { marginTop: 6, color: colors.textSecondary, fontWeight: '700' },

  row: { flexDirection: 'row', gap: 10, marginTop: 14 },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  addBtn: { backgroundColor: colors.accent, borderRadius: 14, paddingHorizontal: 18, justifyContent: 'center' },
  addText: { color: '#fff', fontWeight: '900' },

  refreshBtn: { marginTop: 10, alignSelf: 'flex-start' },
  refreshText: { color: colors.accent, fontWeight: '800' },

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
  title: { fontSize: 16, fontWeight: '900', color: colors.textPrimary },
  titleDone: { textDecorationLine: 'line-through', color: colors.textSecondary },
  status: { marginTop: 6, color: colors.textSecondary, fontWeight: '700' },

  deleteBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
});