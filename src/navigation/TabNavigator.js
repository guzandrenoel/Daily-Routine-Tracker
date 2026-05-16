import { useEffect, useMemo, useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import GoalsScreen from '../screens/GoalsScreen';
import StatsScreen from '../screens/StatsScreen';
import ProfileScreen from '../screens/ProfileScreen';

import { useStore, useAtomValue } from 'jotai';
import { routinesAtom, routinesLoadingAtom } from '../store/atoms';
import {
  refreshRoutines,
  createRoutine,
  toggleRoutine,
  removeRoutine,
  editRoutineTitle,
} from '../store/routinesActions';

import { useThemeColors } from '../styles/useThemeColors';

export default function TabNavigator({ onToggleTheme }) {
  const c = useThemeColors();

  const store = useStore();
  const routines = useAtomValue(routinesAtom);
  const loading = useAtomValue(routinesLoadingAtom);

  const [activeTab, setActiveTab] = useState('Home');

  const [addOpen, setAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const tabs = useMemo(
    () => [
      { key: 'Home', label: 'Home', icon: 'home-variant-outline' },
      { key: 'Goals', label: 'Routines', icon: 'clipboard-check-outline' },
      { key: 'Plus', label: '', icon: 'plus', special: true },
      { key: 'Stats', label: 'Stats', icon: 'chart-bar' },
      { key: 'Profile', label: 'Profile', icon: 'account-outline' },
    ],
    []
  );

  async function refresh() {
    try {
      await refreshRoutines(store.get, store.set);
    } catch (e) {
      Alert.alert('Error', e?.message ?? 'Failed to load routines');
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onAdd(title) {
    try {
      await createRoutine(store.get, store.set, title);
    } catch (e) {
      Alert.alert('Error', e?.message ?? 'Failed to add routine');
    }
  }

  async function onToggle(id, newDone) {
    try {
      await toggleRoutine(store.get, store.set, id, newDone);
    } catch (e) {
      Alert.alert('Error', e?.message ?? 'Failed to update routine');
    }
  }

  async function onDelete(id) {
    try {
      await removeRoutine(store.get, store.set, id);
    } catch (e) {
      Alert.alert('Error', e?.message ?? 'Failed to delete routine');
    }
  }

  async function onEditTitle(id, title) {
    try {
      await editRoutineTitle(store.get, store.set, id, title);
    } catch (e) {
      Alert.alert('Error', e?.message ?? 'Failed to edit routine');
    }
  }

  function openAddModal() {
    setNewTitle('');
    setAddOpen(true);
  }

  function submitAdd() {
    const t = newTitle.trim();
    if (!t) return Alert.alert('Missing', 'Type a routine name first.');
    onAdd(t);
    setAddOpen(false);
    setActiveTab('Goals');
  }

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <View style={styles.content}>
        {activeTab === 'Home' && <HomeScreen onToggleTheme={onToggleTheme} />}
        {activeTab === 'Goals' && (
          <GoalsScreen
            routines={routines}
            loading={loading}
            onRefresh={refresh}
            onAdd={onAdd}
            onToggle={onToggle}
            onDelete={onDelete}
            onEditTitle={onEditTitle}
          />
        )}
        {activeTab === 'Stats' && <StatsScreen />}
        {activeTab === 'Profile' && <ProfileScreen onSync={refresh} syncing={loading} />}
      </View>

      <Modal visible={addOpen} transparent animationType="fade" onRequestClose={() => setAddOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setAddOpen(false)}>
          <Pressable style={[styles.modalCard, { backgroundColor: c.surface, borderColor: c.border }]} onPress={() => {}}>
            <Text style={[styles.modalTitle, { color: c.textPrimary }]}>Add Routine</Text>

            <TextInput
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="e.g. Drink water"
              placeholderTextColor={c.mutedText}
              style={[styles.modalInput, { backgroundColor: c.background, borderColor: c.border, color: c.textPrimary }]}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={submitAdd}
            />

            <View style={styles.modalRow}>
              <Pressable style={[styles.modalBtn, styles.modalBtnGhost, { backgroundColor: c.background, borderColor: c.border }]} onPress={() => setAddOpen(false)}>
                <Text style={[styles.modalBtnGhostText, { color: c.textPrimary }]}>Cancel</Text>
              </Pressable>

              <Pressable style={[styles.modalBtn, styles.modalBtnPrimary, { backgroundColor: c.accent }]} onPress={submitAdd}>
                <Text style={styles.modalBtnPrimaryText}>Add</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <View style={[styles.tabBar, { backgroundColor: c.surface }]}>
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;

          return (
            <Pressable
              key={tab.key}
              onPress={() => (tab.special ? openAddModal() : setActiveTab(tab.key))}
              style={[
                styles.tabButton,
                tab.special && [styles.plusButton, { backgroundColor: c.accent }],
                isActive && !tab.special && styles.tabButtonActive,
              ]}
            >
              <MaterialCommunityIcons
                name={tab.icon}
                size={tab.special ? 30 : 22}
                color={tab.special ? '#FFFFFF' : isActive ? c.accent : c.mutedText}
              />
              {!tab.special && (
                <Text style={[styles.tabLabel, { color: isActive ? c.accent : c.mutedText }]}>
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
  root: { flex: 1 },
  content: { flex: 1 },

  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 14,
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
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: { marginTop: 4, fontSize: 11, fontWeight: '600' },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  modalCard: { borderRadius: 18, padding: 16, borderWidth: 1 },
  modalTitle: { fontSize: 18, fontWeight: '900', marginBottom: 10 },
  modalInput: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontWeight: '700',
  },
  modalRow: { flexDirection: 'row', gap: 10, marginTop: 12, justifyContent: 'flex-end' },
  modalBtn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 14 },
  modalBtnGhost: { borderWidth: 1 },
  modalBtnGhostText: { fontWeight: '900' },
  modalBtnPrimary: {},
  modalBtnPrimaryText: { color: '#fff', fontWeight: '900' },
});