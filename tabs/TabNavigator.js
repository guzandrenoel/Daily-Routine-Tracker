import { Pressable, StyleSheet, Text, View, Alert } from 'react-native';
import { useEffect, useState } from 'react';
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
} from '../utils/routinesApi';

export default function TabNavigator({ isDarkMode, onToggleTheme }) {
  const [activeTab, setActiveTab] = useState('Home');
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    try {
      setLoading(true);
      const list = await getRoutines();
      setRoutines(list);
    } catch (e) {
      Alert.alert('Error', e.message ?? 'Failed to load routines');
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
      Alert.alert('Error', e.message ?? 'Failed to add routine');
    }
  }

  async function onToggle(id, newDone) {
    try {
      const updated = await toggleRoutineDone(id, newDone);
      setRoutines((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (e) {
      Alert.alert('Error', e.message ?? 'Failed to update routine');
    }
  }

  async function onDelete(id) {
    try {
      await deleteRoutine(id);
      setRoutines((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      Alert.alert('Error', e.message ?? 'Failed to delete routine');
    }
  }

  const tabs = [
    { key: 'Home', label: 'Home', icon: 'home-variant-outline' },
    { key: 'Goals', label: 'Routines', icon: 'clipboard-check-outline' },
    { key: 'Plus', label: '', icon: 'plus', special: true },
    { key: 'Reminders', label: 'Stats', icon: 'chart-bar' },
    { key: 'Profile', label: 'Profile', icon: 'account-outline' },
  ];

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
          />
        )}

        {activeTab === 'Reminders' && <RemindersScreen routines={routines} />}

        {activeTab === 'Profile' && (
          <View style={styles.placeholderScreen}>
            <Text style={styles.placeholderTitle}>Profile</Text>
            <Text style={styles.placeholderText}>Supabase connected ✅</Text>
          </View>
        )}
      </View>

      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;

          return (
            <Pressable
              key={tab.key}
              onPress={() => {
                if (tab.special) {
                  setActiveTab('Goals'); // plus jumps to Routines
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
  placeholderTitle: { fontSize: 28, fontWeight: '800', color: colors.textPrimary, marginBottom: 10 },
  placeholderText: { fontSize: 16, color: colors.textSecondary, textAlign: 'center' },

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
  },
  tabLabel: { marginTop: 4, fontSize: 11, fontWeight: '600', color: colors.mutedText },
  tabLabelActive: { color: colors.accent },
});