import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useMemo, useState } from 'react';

import GoalsScreen from './GoalsScreen';
import HomeScreen from './HomeScreen';
import RemindersScreen from './RemindersScreen';

export default function TabNavigator() {
  const [activeTab, setActiveTab] = useState('Home');

  const ActiveScreen = useMemo(() => {
    if (activeTab === 'Goals') {
      return GoalsScreen;
    }

    if (activeTab === 'Reminders') {
      return RemindersScreen;
    }

    return HomeScreen;
  }, [activeTab]);

  return (
    <View style={styles.root}>
      <View style={styles.content}>
        <ActiveScreen />
      </View>

      <View style={styles.tabBar}>
        {['Home', 'Goals', 'Reminders'].map((tab) => {
          const isActive = tab === activeTab;

          return (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
            >
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  tabButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  tabButtonActive: {
    backgroundColor: '#DBEAFE',
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  tabLabelActive: {
    color: '#1D4ED8',
  },
});
