import { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../styles/theme';

export default function GoalsScreen({
  routines,
  loading,
  onRefresh,
  onAdd,
  onToggle,
  onDelete,
  onEditTitle, // ✅ NEW
}) {
  const [title, setTitle] = useState('');

  // menu + modals
  const [menuRoutine, setMenuRoutine] = useState(null); // routine object
  const [statsRoutine, setStatsRoutine] = useState(null);
  const [editRoutine, setEditRoutine] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  function handleAdd() {
    const t = title.trim();
    if (!t) {
      Alert.alert('Missing', 'Type a routine name first.');
      return;
    }
    onAdd(t);
    setTitle('');
  }

  function openMenu(routine) {
    setMenuRoutine(routine);
  }

  function closeMenu() {
    setMenuRoutine(null);
  }

  function openStatsFromMenu() {
    if (!menuRoutine) return;
    setStatsRoutine(menuRoutine);
    closeMenu();
  }

  function openEditFromMenu() {
    if (!menuRoutine) return;
    setEditRoutine(menuRoutine);
    setEditTitle(menuRoutine.title ?? '');
    closeMenu();
  }

  async function submitEdit() {
    const t = editTitle.trim();
    if (!t) {
      Alert.alert('Missing', 'Title cannot be empty.');
      return;
    }
    try {
      await onEditTitle(editRoutine.id, t);
      setEditRoutine(null);
      setEditTitle('');
    } catch (e) {
      Alert.alert('Error', e?.message ?? 'Failed to update routine');
    }
  }

  const renderItem = ({ item }) => {
    const done = !!item.done;

    return (
      <Pressable
        onPress={() => onToggle(item.id, !done)}
        style={[styles.card, done && styles.cardDone]}
      >
        {/* Left circle check icon */}
        <Pressable
          onPress={(e) => {
            e?.stopPropagation?.();
            onToggle(item.id, !done);
          }}
          onPressIn={(e) => e?.stopPropagation?.()}
          style={styles.checkWrap}
        >
          <MaterialCommunityIcons
            name={done ? 'check-circle' : 'checkbox-blank-circle-outline'}
            size={28}
            color={done ? colors.accent : colors.mutedText}
          />
        </Pressable>

        {/* Title + small status */}
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, done && styles.titleDone]}>
            {item.title}
          </Text>
          <Text style={styles.status}>{done ? 'Done' : 'Not done'}</Text>
        </View>

        {/* 3-dots menu */}
        <Pressable
          onPress={(e) => {
            e?.stopPropagation?.();
            openMenu(item);
          }}
          onPressIn={(e) => e?.stopPropagation?.()}
          style={styles.menuBtn}
        >
          <MaterialCommunityIcons name="dots-vertical" size={22} color={colors.textSecondary} />
        </Pressable>
      </Pressable>
    );
  };

  const createdText = (r) => {
    if (!r?.created_at) return '—';
    const d = new Date(r.created_at);
    if (Number.isNaN(d.getTime())) return String(r.created_at);
    return d.toLocaleString();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Routines</Text>
      <Text style={styles.subtext}>Tap a routine to mark it done.</Text>

      <View style={styles.row}>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="New routine (e.g. Drink water)"
          placeholderTextColor={colors.mutedText}
          style={styles.input}
          returnKeyType="done"
          onSubmitEditing={handleAdd}
        />
        <Pressable style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addText}>Add</Text>
        </Pressable>
      </View>

      <Pressable style={styles.syncBtn} onPress={onRefresh} disabled={loading}>
        <MaterialCommunityIcons
          name="sync"
          size={18}
          color={loading ? colors.mutedText : colors.accent}
        />
        <Text style={[styles.syncText, loading && { color: colors.mutedText }]}>
          {loading ? 'Syncing…' : 'Sync'}
        </Text>
      </Pressable>

      <FlatList
        data={routines}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 40 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No routines yet. Add your first one 👆</Text>
        }
        renderItem={renderItem}
      />

      {/* MENU MODAL (Edit / Statistics / Delete) */}
      <Modal
        visible={!!menuRoutine}
        transparent
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <Pressable style={styles.modalBackdrop} onPress={closeMenu}>
          <Pressable style={styles.menuCard} onPress={() => {}}>
            <Text style={styles.menuTitle}>{menuRoutine?.title}</Text>

            <Pressable style={styles.menuItem} onPress={openEditFromMenu}>
              <MaterialCommunityIcons name="pencil" size={18} color={colors.textPrimary} />
              <Text style={styles.menuItemText}>Edit</Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={openStatsFromMenu}>
              <MaterialCommunityIcons name="chart-bar" size={18} color={colors.textPrimary} />
              <Text style={styles.menuItemText}>Statistics</Text>
            </Pressable>

            <View style={styles.menuDivider} />

            <Pressable
              style={styles.menuItem}
              onPress={() => {
                const id = menuRoutine?.id;
                closeMenu();
                if (!id) return;
                Alert.alert('Delete routine?', 'This cannot be undone.', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: () => onDelete(id) },
                ]);
              }}
            >
              <MaterialCommunityIcons name="trash-can-outline" size={18} color="#B42318" />
              <Text style={[styles.menuItemText, { color: '#B42318' }]}>Delete</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* STATS MODAL */}
      <Modal
        visible={!!statsRoutine}
        transparent
        animationType="fade"
        onRequestClose={() => setStatsRoutine(null)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setStatsRoutine(null)}>
          <Pressable style={styles.statsCard} onPress={() => {}}>
            <Text style={styles.statsTitle}>Routine stats</Text>

            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Title</Text>
              <Text style={styles.statsValue}>{statsRoutine?.title ?? '—'}</Text>
            </View>

            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Status</Text>
              <Text style={styles.statsValue}>
                {statsRoutine?.done ? 'Done' : 'Not done'}
              </Text>
            </View>

            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Created</Text>
              <Text style={styles.statsValue}>{createdText(statsRoutine)}</Text>
            </View>

            <Pressable style={styles.statsCloseBtn} onPress={() => setStatsRoutine(null)}>
              <Text style={styles.statsCloseText}>Close</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        visible={!!editRoutine}
        transparent
        animationType="fade"
        onRequestClose={() => setEditRoutine(null)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setEditRoutine(null)}>
          <Pressable style={styles.editCard} onPress={() => {}}>
            <Text style={styles.editTitle}>Edit routine</Text>

            <TextInput
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder="Routine name"
              placeholderTextColor={colors.mutedText}
              style={styles.editInput}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={submitEdit}
            />

            <View style={styles.editRow}>
              <Pressable
                style={[styles.editBtn, styles.editBtnGhost]}
                onPress={() => setEditRoutine(null)}
              >
                <Text style={styles.editBtnGhostText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[styles.editBtn, styles.editBtnPrimary]}
                onPress={submitEdit}
              >
                <Text style={styles.editBtnPrimaryText}>Save</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
  addBtn: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  addText: { color: '#fff', fontWeight: '900' },

  syncBtn: {
    marginTop: 10,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  syncText: { color: colors.accent, fontWeight: '900' },

  empty: { textAlign: 'center', marginTop: 18, color: colors.mutedText, fontWeight: '700' },

  card: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  cardDone: { backgroundColor: colors.accentTint },

  checkWrap: {
    width: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  titleDone: { textDecorationLine: 'line-through', color: colors.textSecondary },
  status: { marginTop: 6, color: colors.textSecondary, fontWeight: '700' },

  menuBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },

  // shared modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },

  // menu
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  menuItemText: { fontWeight: '800', color: colors.textPrimary },
  menuDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
    opacity: 0.9,
  },

  // stats
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statsTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary, marginBottom: 12 },
  statsRow: { marginBottom: 10 },
  statsLabel: { color: colors.mutedText, fontWeight: '800' },
  statsValue: { marginTop: 4, color: colors.textPrimary, fontWeight: '800' },
  statsCloseBtn: {
    marginTop: 8,
    alignSelf: 'flex-end',
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  statsCloseText: { color: '#fff', fontWeight: '900' },

  // edit
  editCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  editTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary, marginBottom: 10 },
  editInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  editRow: { flexDirection: 'row', gap: 10, marginTop: 12, justifyContent: 'flex-end' },
  editBtn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 14 },
  editBtnGhost: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  editBtnGhostText: { color: colors.textPrimary, fontWeight: '900' },
  editBtnPrimary: { backgroundColor: colors.accent },
  editBtnPrimaryText: { color: '#fff', fontWeight: '900' },
});