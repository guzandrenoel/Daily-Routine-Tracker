import { Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../styles/theme";

import GoalsScreen from "./GoalsScreen";
import HomeScreen from "./HomeScreen";
import RemindersScreen from "./RemindersScreen";

function ProfileScreen({ user, onLogout }) {
  return (
    <View style={styles.profile}>
      <Text style={styles.profileTitle}>Profile</Text>
      <Text style={styles.profileText}>Logged in as: {user?.username}</Text>

      <Pressable style={styles.logoutBtn} onPress={onLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
}

export default function TabNavigator({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("Home");

  // simple shared data for now
  const [routines, setRoutines] = useState([]);

  const tabs = [
    { key: "Home", label: "Home", icon: "home-variant-outline" },
    { key: "Goals", label: "Routines", icon: "clipboard-check-outline" },
    { key: "Plus", label: "", icon: "plus", special: true },
    { key: "Reminders", label: "Stats", icon: "chart-bar" },
    { key: "Profile", label: "Profile", icon: "account-outline" },
  ];

  function renderScreen() {
    if (activeTab === "Goals") {
      return <GoalsScreen user={user} routines={routines} setRoutines={setRoutines} />;
    }
    if (activeTab === "Reminders") {
      return <RemindersScreen user={user} routines={routines} />;
    }
    if (activeTab === "Profile") {
      return <ProfileScreen user={user} onLogout={onLogout} />;
    }
    return <HomeScreen user={user} routines={routines} />;
  }

  return (
    <View style={styles.root}>
      <View style={styles.content}>{renderScreen()}</View>

      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;

          return (
            <Pressable
              key={tab.key}
              onPress={() => {
                if (tab.special) return; // later: open add routine modal
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
                color={tab.special ? "#FFFFFF" : isActive ? colors.accent : colors.mutedText}
              />
              {!tab.special && (
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text>
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

  profile: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  profileTitle: { fontSize: 28, fontWeight: "800", color: colors.textPrimary, marginBottom: 10 },
  profileText: { fontSize: 16, color: colors.textSecondary, textAlign: "center" },

  logoutBtn: {
    marginTop: 18,
    backgroundColor: colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  logoutText: { color: "#fff", fontWeight: "900" },

  tabBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
    backgroundColor: colors.surface,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
  tabButton: { flex: 1, paddingVertical: 8, alignItems: "center", justifyContent: "center" },
  tabButtonActive: { transform: [{ translateY: -1 }] },

  plusButton: {
    flex: 0,
    width: 54,
    height: 54,
    marginHorizontal: 8,
    marginTop: -28,
    borderRadius: 27,
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.28,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  tabLabel: { marginTop: 4, fontSize: 11, fontWeight: "700", color: colors.mutedText },
  tabLabelActive: { color: colors.accent },
});