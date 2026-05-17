import { useMemo, useState } from 'react';
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
import { useThemeColors } from '../styles/useThemeColors';
import { useAtomValue } from 'jotai';
import { completionsAtom, selectedDateAtom } from '../store/atoms';

export default function GoalsScreen({
  routines,
  loading,
  onRefresh,
  onAdd,
  onToggle,
  onDelete,
  onEditTitle,
}) {
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const completions = useAtomValue(completionsAtom);
  const selectedDate = useAtomValue(selectedDateAtom);

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  const [title, setTitle] = useState('');
  const [menuRoutine, setMenuRoutine] = useState(null);
  const [statsRoutine, setStatsRoutine] = useState(null);
  const [editRoutine, setEditRoutine] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  function handleAdd() {
    const t = title.trim();
    if (!t) { Alert.alert('Missing', 'Type a routine name first.'); return; }
    onAdd(t);
    setTitle('');
  }

  function openMenu(routine) { setMenuRoutine(routine); }
  function closeMenu() { setMenuRoutine(null); }

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
    if (!t) { Alert.alert('Missing', 'Title cannot be empty.'); return; }
    try {
      await onEditTitle(editRoutine.id, t);
      setEditRoutine(null);
      setEditTitle('');
    } catch (e) {
      Alert.alert('Error', e?.message ?? 'Failed to update routine');
    }
  }

  const selectedDateLabel = selectedDate.toLocaleDateString(undefined, {
    weekday: 'short', month: 'short', day: 'numeric',
  });

  const doneCount = routines.filter((r) => completions.has(r.id)).length;
  const totalCount = routines.length;
  const pct = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);

  function createdText(r) {
    if (!r?.created_at) return '—';
    const d = new Date(r.created_at);
    if (Number.isNaN(d.getTime())) return String(r.created_at);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function daysActive(r) {
    if (!r?.created_at) return null;
    const d = new Date(r.created_at);
    if (Number.isNaN(d.getTime())) return null;
    const diff = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Added today';
    if (diff === 1) return 'Added yesterday';
    return `Active for ${diff} days`;
  }

  const renderItem = ({ item }) => {
    const done = completions.has(item.id);

    return (
      <Pressable
        onPress={() => onToggle(item.id, !done)}
        style={[styles.card, done && styles.cardDone]}
      >
        <Pressable
          onPress={(e) => { e?.stopPropagation?.(); onToggle(item.id, !done); }}
          onPressIn={(e) => e?.stopPropagation?.()}
          style={styles.checkWrap}
        >
          <MaterialCommunityIcons
            name={done ? 'check-circle' : 'checkbox-blank-circle-outline'}
            size={28}
            color={done ? colors.accent : colors.mutedText}
          />
        </Pressable>

        <View style={{ flex: 1 }}>
          <Text style={[styles.title, done && styles.titleDone]}>{item.title}</Text>
          <Text style={styles.status}>{done ? `Done · ${selectedDateLabel}` : 'Not done'}</Text>
        </View>

        <Pressable
          onPress={(e) => { e?.stopPropagation?.(); openMenu(item); }}
          onPressIn={(e) => e?.stopPropagation?.()}
          style={styles.menuBtn}
        >
          <MaterialCommunityIcons name="dots-vertical" size={22} color={colors.textSecondary} />
        </Pressable>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Routines</Text>

      {/* Date context banner */}
      <View style={[styles.dateBanner, { backgroundColor: colors.accentTint, borderColor: colors.accent }]}>
        <MaterialCommunityIcons name="calendar" size={14} color={colors.accent} />
        <Text style={[styles.dateBannerText, { color: colors.accent }]}>
          {isToday ? "Showing today's progress" : `Showing progress for ${selectedDateLabel}`}
        </Text>
      </View>

      {isToday && (
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
      )}

      <FlatList
        data={routines}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 40 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No routines yet. Add your first one 👆</Text>
        }
        renderItem={renderItem}
      />

      {/* ── MENU MODAL ── */}
      <Modal visible={!!menuRoutine} transparent animationType="fade" onRequestClose={closeMenu}>
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

      {/* ── STATS MODAL ── */}
      <Modal visible={!!statsRoutine} transparent animationType="fade" onRequestClose={() => setStatsRoutine(null)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setStatsRoutine(null)}>
          <Pressable style={styles.statsCard} onPress={() => {}}>

            <View style={styles.statsHeader}>
              <View style={[styles.statsIconWrap, { backgroundColor: colors.accentTint }]}>
                <MaterialCommunityIcons name="clipboard-check-outline" size={22} color={colors.accent} />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.statsTitle}>{statsRoutine?.title ?? '—'}</Text>
                <Text style={[styles.statsSubtitle, { color: colors.mutedText }]}>
                  {daysActive(statsRoutine)}
                </Text>
              </View>
            </View>

            {(() => {
              const isDone = statsRoutine && completions.has(statsRoutine.id);
              return (
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: isDone ? 'rgba(52,195,143,0.12)' : colors.accentTint,
                    borderColor: isDone ? '#34C38F' : colors.border }
                ]}>
                  <MaterialCommunityIcons
                    name={isDone ? 'check-circle' : 'clock-outline'}
                    size={16}
                    color={isDone ? '#34C38F' : colors.mutedText}
                  />
                  <Text style={[styles.statusBadgeText, { color: isDone ? '#34C38F' : colors.mutedText }]}>
                    {isDone ? `Completed on ${selectedDateLabel}` : `Not done on ${selectedDateLabel}`}
                  </Text>
                </View>
              );
            })()}

            <View style={[styles.statsGrid, { borderColor: colors.border }]}>
              <View style={styles.statsGridItem}>
                <Text style={[styles.statsGridVal, { color: colors.accent }]}>{doneCount}/{totalCount}</Text>
                <Text style={[styles.statsGridLabel, { color: colors.mutedText }]}>Done today</Text>
              </View>
              <View style={[styles.statsGridDivider, { backgroundColor: colors.border }]} />
              <View style={styles.statsGridItem}>
                <Text style={[styles.statsGridVal, { color: colors.accent }]}>{pct}%</Text>
                <Text style={[styles.statsGridLabel, { color: colors.mutedText }]}>Day rate</Text>
              </View>
              <View style={[styles.statsGridDivider, { backgroundColor: colors.border }]} />
              <View style={styles.statsGridItem}>
                <Text style={[styles.statsGridVal, { color: colors.accent }]}>{totalCount}</Text>
                <Text style={[styles.statsGridLabel, { color: colors.mutedText }]}>Total</Text>
              </View>
            </View>

            <View style={[styles.statsInfoRow, { borderColor: colors.border }]}>
              <MaterialCommunityIcons name="calendar-plus" size={15} color={colors.mutedText} />
              <Text style={[styles.statsInfoText, { color: colors.mutedText }]}>
                Created {createdText(statsRoutine)}
              </Text>
            </View>

            <Pressable style={[styles.statsCloseBtn, { backgroundColor: colors.accent }]} onPress={() => setStatsRoutine(null)}>
              <Text style={styles.statsCloseText}>Close</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ── EDIT MODAL ── */}
      <Modal visible={!!editRoutine} transparent animationType="fade" onRequestClose={() => setEditRoutine(null)}>
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
              <Pressable style={[styles.editBtn, styles.editBtnGhost]} onPress={() => setEditRoutine(null)}>
                <Text style={styles.editBtnGhostText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.editBtn, styles.editBtnPrimary]} onPress={submitEdit}>
                <Text style={styles.editBtnPrimaryText}>Save</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, paddingTop: 56, paddingHorizontal: 18 },
    heading: { fontSize: 30, fontWeight: '900', color: colors.textPrimary },

    dateBanner: {
      flexDirection: 'row', alignItems: 'center', gap: 6,
      borderWidth: 1, borderRadius: 12, paddingVertical: 8, paddingHorizontal: 12,
      marginTop: 8, marginBottom: 4,
    },
    dateBannerText: { fontSize: 13, fontWeight: '800' },

    row: { flexDirection: 'row', gap: 10, marginTop: 10 },
    input: {
      flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
      borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12,
      color: colors.textPrimary, fontWeight: '700',
    },
    addBtn: { backgroundColor: colors.accent, borderRadius: 14, paddingHorizontal: 18, justifyContent: 'center' },
    addText: { color: '#fff', fontWeight: '900' },

    empty: { textAlign: 'center', marginTop: 18, color: colors.mutedText, fontWeight: '700' },

    card: {
      flexDirection: 'row', gap: 12, alignItems: 'center',
      backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
      borderRadius: 16, paddingVertical: 14, paddingHorizontal: 14, marginBottom: 10,
    },
    cardDone: { backgroundColor: colors.accentTint },
    checkWrap: { width: 38, alignItems: 'center', justifyContent: 'center' },
    title: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
    titleDone: { textDecorationLine: 'line-through', color: colors.textSecondary },
    status: { marginTop: 6, color: colors.textSecondary, fontWeight: '700' },
    menuBtn: {
      width: 42, height: 42, borderRadius: 14,
      alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface,
    },

    modalBackdrop: {
      flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', paddingHorizontal: 18,
    },

    menuCard: { backgroundColor: colors.surface, borderRadius: 18, padding: 14, borderWidth: 1, borderColor: colors.border },
    menuTitle: { fontSize: 16, fontWeight: '900', color: colors.textPrimary, marginBottom: 8 },
    menuItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingHorizontal: 10, borderRadius: 12 },
    menuItemText: { fontWeight: '800', color: colors.textPrimary },
    menuDivider: { height: 1, backgroundColor: colors.border, marginVertical: 8 },

    statsCard: { backgroundColor: colors.surface, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: colors.border },
    statsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
    statsIconWrap: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    statsTitle: { fontSize: 17, fontWeight: '900', color: colors.textPrimary },
    statsSubtitle: { fontSize: 12, fontWeight: '700', marginTop: 2 },

    statusBadge: {
      flexDirection: 'row', alignItems: 'center', gap: 6,
      borderWidth: 1, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12, marginBottom: 16,
    },
    statusBadgeText: { fontWeight: '800', fontSize: 13 },

    statsGrid: { flexDirection: 'row', borderWidth: 1, borderRadius: 14, overflow: 'hidden', marginBottom: 14 },
    statsGridItem: { flex: 1, alignItems: 'center', paddingVertical: 14 },
    statsGridVal: { fontSize: 20, fontWeight: '900' },
    statsGridLabel: { fontSize: 11, fontWeight: '700', marginTop: 3 },
    statsGridDivider: { width: 1 },

    statsInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, borderTopWidth: 1, paddingTop: 12, marginBottom: 14 },
    statsInfoText: { fontSize: 12, fontWeight: '700' },

    statsCloseBtn: { alignSelf: 'flex-end', borderRadius: 14, paddingVertical: 10, paddingHorizontal: 20 },
    statsCloseText: { color: '#fff', fontWeight: '900' },

    editCard: { backgroundColor: colors.surface, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border },
    editTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary, marginBottom: 10 },
    editInput: {
      backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border,
      borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12,
      color: colors.textPrimary, fontWeight: '700',
    },
    editRow: { flexDirection: 'row', gap: 10, marginTop: 12, justifyContent: 'flex-end' },
    editBtn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 14 },
    editBtnGhost: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
    editBtnGhostText: { color: colors.textPrimary, fontWeight: '900' },
    editBtnPrimary: { backgroundColor: colors.accent },
    editBtnPrimaryText: { color: '#fff', fontWeight: '900' },
  });
}