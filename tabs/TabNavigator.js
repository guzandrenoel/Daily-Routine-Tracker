import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../styles/theme';

import GoalsScreen from './GoalsScreen';
import HomeScreen from './HomeScreen';
import RemindersScreen from './RemindersScreen';

import {
  getRoutines,
  addRoutine,
  toggleRoutineDone,
  deleteRoutine,
  updateRoutineTitle, // ✅ NEW
} from '../utils/routinesApi';

function ProfileScreen({ onSync, syncing }) {
  return (
    <View style={styles.placeholderScreen}>
      <Text style={styles.placeholderTitle}>Profile</Text>
      <Text style={styles.placeholderText}>Supabase connected ✅</Text>

      <Pressable
        style={[styles.profileBtn, syncing && { opacity: 0.7 }]}
        onPress={onSync}
        disabled={syncing}
      >
        <Text style={styles.profileBtnText}>{syncing ? 'Syncing…' : 'Sync now'}</Text>
      </Pressable>

      <Text style={styles.smallNote}>
        Tip: Routines are saved in your Supabase table
      </Text>
    </View>
  );
}

export default function TabNavigator({ isDarkMode, onToggleTheme }) {
  const [activeTab, setActiveTab] = useState('Home');
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal for the "+" button
  const [addOpen, setAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const tabs = useMemo(
    () => [
      { key: 'Home', label: 'Home', icon: 'home-variant-outline' },
      { key: 'Goals', label: 'Routines', icon: 'clipboard-check-outline' },
      { key: 'Plus', label: '', icon: 'plus', special: true },
      { key: 'Reminders', label: 'Stats', icon: 'chart-bar' },
      { key: 'Profile', label: 'Profile', icon: 'account-outline' },
    ],
    []
  );

  async function refresh() {
    try {
      setLoading(true);
      const list = await getRoutines();
      setRoutines(list);
    } catch (e) {
      Alert.alert('Error', e?.message ?? 'Failed to load routines');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onAdd(title) {
    try {
      const created = await addRoutine(title);
      setRoutines((prev) => [created, ...prev]);
    } catch (e) {
      Alert.alert('Error', e?.message ?? 'Failed to add routine');
    }
  }

  async function onToggle(id, newDone) {
    try {
      const updated = await toggleRoutineDone(id, newDone);
      setRoutines((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (e) {
      Alert.alert('Error', e?.message ?? 'Failed to update routine');
    }
  }

  async function onDelete(id) {
    try {
      await deleteRoutine(id);
      setRoutines((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      Alert.alert('Error', e?.message ?? 'Failed to delete routine');
    }
  }

  // ✅ NEW: edit title
  async function onEditTitle(id, title) {
    const updated = await updateRoutineTitle(id, title);
    setRoutines((prev) => prev.map((r) => (r.id === id ? updated : r)));
    return updated;
  }

  function openAddModal() {
    setNewTitle('');
    setAddOpen(true);
  }

  function submitAdd() {
    const t = newTitle.trim();
    if (!t) {
      Alert.alert('Missing', 'Type a routine name first.');
      return;
    }
    onAdd(t);
    setAddOpen(false);
    setActiveTab('Goals');
  }

  return (
    <View style={styles.root}>
      <View style={styles.content}>
        {activeTab === 'Home' && (
          <HomeScreen
            routines={routines}
            isDarkMode={isDarkMode}
            onToggleTheme={onToggleTheme}
          />
        )}

        {activeTab === 'Goals' && (
          <GoalsScreen
            routines={routines}
            loading={loading}
            onRefresh={refresh}
            onAdd={onAdd}
            onToggle={onToggle}
            onDelete={onDelete}
            onEditTitle={onEditTitle} // ✅ NEW
          />
        )}

        {activeTab === 'Reminders' && <RemindersScreen routines={routines} />}

        {activeTab === 'Profile' && <ProfileScreen onSync={refresh} syncing={loading} />}
      </View>

      {/* + Modal */}
      <Modal visible={addOpen} transparent animationType="fade" onRequestClose={() => setAddOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setAddOpen(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>Add Routine</Text>

            <TextInput
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="e.g. Drink water"
              placeholderTextColor={colors.mutedText}
              style={styles.modalInput}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={submitAdd}
            />

            <View style={styles.modalRow}>
              <Pressable style={[styles.modalBtn, styles.modalBtnGhost]} onPress={() => setAddOpen(false)}>
                <Text style={styles.modalBtnGhostText}>Cancel</Text>
              </Pressable>

              <Pressable style={[styles.modalBtn, styles.modalBtnPrimary]} onPress={submitAdd}>
                <Text style={styles.modalBtnPrimaryText}>Add</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;

          return (
            <Pressable
              key={tab.key}
              onPress={() => {
                if (tab.special) {
                  openAddModal();
                  return;
                }
                setActiveTab(tab.key);
              }}
              style={[
                styles.tabButton,
                tab.special && styles.plusButton,
                isActive && !tab.special && styles.tabButtonActive,
              ]}
            >
              <MaterialCommunityIcons
                name={tab.icon}
                size={tab.special ? 30 : 22}
                color={tab.special ? '#FFFFFF' : isActive ? colors.accent : colors.mutedText}
              />
              {!tab.special && (
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1 },

  placeholderScreen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  placeholderTitle: { fontSize: 28, fontWeight: '900', color: colors.textPrimary, marginBottom: 8 },
  placeholderText: { fontSize: 16, color: colors.textSecondary, textAlign: 'center', fontWeight: '700' },

  profileBtn: {
    marginTop: 16,
    backgroundColor: colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
  },
  profileBtnText: { color: '#fff', fontWeight: '900' },
  smallNote: { marginTop: 14, color: colors.mutedText, fontWeight: '700', textAlign: 'center' },

  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
  tabButton: { flex: 1, paddingVertical: 8, alignItems: 'center', justifyContent: 'center' },
  tabButtonActive: { transform: [{ translateY: -1 }] },
  plusButton: {
    flex: 0,
    width: 54,
    height: 54,
    marginHorizontal: 8,
    marginTop: -28,
    borderRadius: 27,
    backgroundColor: colors.accent,
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: { marginTop: 4, fontSize: 11, fontWeight: '600', color: colors.mutedText },
  tabLabelActive: { color: colors.accent },

  // Modal styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary, marginBottom: 10 },
  modalInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  modalRow: { flexDirection: 'row', gap: 10, marginTop: 12, justifyContent: 'flex-end' },
  modalBtn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 14 },
  modalBtnGhost: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  modalBtnGhostText: { color: colors.textPrimary, fontWeight: '900' },
  modalBtnPrimary: { backgroundColor: colors.accent },
  modalBtnPrimaryText: { color: '#fff', fontWeight: '900' },
});