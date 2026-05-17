import { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors } from '../styles/useThemeColors';
import { useAtomValue } from 'jotai';
import { routinesStatsAtom } from '../store/atoms';

const DEFAULT_NAME = 'DayFlow User';
const DEFAULT_BIO = 'Building better habits, one day at a time.';

export default function ProfileScreen({ onSync, syncing }) {
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { total, done, remaining, percent } = useAtomValue(routinesStatsAtom);

  const [displayName, setDisplayName] = useState(DEFAULT_NAME);
  const [bio, setBio] = useState(DEFAULT_BIO);
  const [editOpen, setEditOpen] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [draftBio, setDraftBio] = useState('');

  function openEdit() {
    setDraftName(displayName);
    setDraftBio(bio);
    setEditOpen(true);
  }

  function saveEdit() {
    const n = draftName.trim();
    if (!n) return Alert.alert('Missing', 'Name cannot be empty.');
    setDisplayName(n);
    setBio(draftBio.trim() || DEFAULT_BIO);
    setEditOpen(false);
  }

  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const settingsRows = [
    {
      icon: 'bell-outline',
      label: 'Notifications',
      value: 'On',
      onPress: () => Alert.alert('Coming soon', 'Notification settings coming soon.'),
    },
    {
      icon: 'repeat',
      label: 'Reset Daily Routines',
      value: '',
      onPress: () =>
        Alert.alert('Reset routines?', 'This will sync and refresh your routines.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Reset', style: 'destructive', onPress: onSync },
        ]),
    },
    {
      icon: 'shield-lock-outline',
      label: 'Privacy',
      value: '',
      onPress: () => Alert.alert('Coming soon', 'Privacy settings coming soon.'),
    },
    {
      icon: 'help-circle-outline',
      label: 'Help & Support',
      value: '',
      onPress: () => Alert.alert('Help', 'Need help? Reach out at support@dayflow.app'),
    },
    {
      icon: 'information-outline',
      label: 'About DayFlow',
      value: 'v1.0.0',
      onPress: () =>
        Alert.alert('DayFlow', 'Your daily routine tracker.\nBuilt with Expo + React Native.'),
    },
  ];

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>Profile</Text>

      {/* ── Avatar Card ── */}
      <View style={[styles.avatarCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {/* Teal banner */}
        <View style={[styles.avatarBand, { backgroundColor: colors.accent }]} />

        {/* Edit button */}
        <Pressable
          style={[styles.editIconBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={openEdit}
        >
          <MaterialCommunityIcons name="pencil-outline" size={16} color={colors.accent} />
        </Pressable>

        {/* Avatar */}
        <View style={[styles.avatarCircle, { backgroundColor: colors.accent, borderColor: colors.surface }]}>
          <Text style={styles.avatarInitials}>{initials}</Text>
        </View>

        <Text style={[styles.profileName, { color: colors.textPrimary }]}>{displayName}</Text>
        <Text style={[styles.profileBio, { color: colors.mutedText }]}>{bio}</Text>

        {/* Mini stats */}
        <View style={styles.miniStatsRow}>
          <View style={styles.miniStat}>
            <Text style={[styles.miniStatVal, { color: colors.accent }]}>{total}</Text>
            <Text style={[styles.miniStatLabel, { color: colors.mutedText }]}>Routines</Text>
          </View>
          <View style={[styles.miniStatDivider, { backgroundColor: colors.border }]} />
          <View style={styles.miniStat}>
            <Text style={[styles.miniStatVal, { color: colors.accent }]}>{done}</Text>
            <Text style={[styles.miniStatLabel, { color: colors.mutedText }]}>Done</Text>
          </View>
          <View style={[styles.miniStatDivider, { backgroundColor: colors.border }]} />
          <View style={styles.miniStat}>
            <Text style={[styles.miniStatVal, { color: colors.accent }]}>{percent}%</Text>
            <Text style={[styles.miniStatLabel, { color: colors.mutedText }]}>Rate</Text>
          </View>
        </View>
      </View>

      {/* ── Progress card ── */}
      <View style={[styles.progressCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressTitle, { color: colors.textPrimary }]}>Today's Completion</Text>
          <Text style={[styles.progressPct, { color: colors.accent }]}>{percent}%</Text>
        </View>
        <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
          <View style={[styles.progressFill, { width: `${Math.max(percent, 0)}%`, backgroundColor: colors.accent }]} />
        </View>
        <Text style={[styles.progressSub, { color: colors.mutedText }]}>
          {done} of {total} routines completed · {remaining} remaining
        </Text>
      </View>

      {/* ── Settings ── */}
      <Text style={[styles.sectionLabel, { color: colors.mutedText }]}>PREFERENCES</Text>
      <View style={[styles.settingsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {settingsRows.map((row, i) => (
          <Pressable
            key={row.label}
            style={[
              styles.settingsRow,
              i < settingsRows.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
            ]}
            onPress={row.onPress}
          >
            <View style={[styles.settingsIcon, { backgroundColor: colors.accentTint }]}>
              <MaterialCommunityIcons name={row.icon} size={18} color={colors.accent} />
            </View>
            <Text style={[styles.settingsLabel, { color: colors.textPrimary }]}>{row.label}</Text>
            <View style={styles.settingsRight}>
              {row.value ? (
                <Text style={[styles.settingsValue, { color: colors.mutedText }]}>{row.value}</Text>
              ) : null}
              <MaterialCommunityIcons name="chevron-right" size={18} color={colors.mutedText} />
            </View>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.footer, { color: colors.mutedText }]}>DayFlow · v1.0.0</Text>

      {/* ── Edit Modal ── */}
      <Modal visible={editOpen} transparent animationType="fade" onRequestClose={() => setEditOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setEditOpen(false)}>
          <Pressable
            style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => {}}
          >
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Edit Profile</Text>

            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Display Name</Text>
            <TextInput
              value={draftName}
              onChangeText={setDraftName}
              placeholder="Your name"
              placeholderTextColor={colors.mutedText}
              style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
              autoFocus
              returnKeyType="next"
            />

            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Bio</Text>
            <TextInput
              value={draftBio}
              onChangeText={setDraftBio}
              placeholder="A short bio..."
              placeholderTextColor={colors.mutedText}
              style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
              returnKeyType="done"
              onSubmitEditing={saveEdit}
            />

            <View style={styles.modalRow}>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border }]}
                onPress={() => setEditOpen(false)}
              >
                <Text style={[styles.modalBtnText, { color: colors.textPrimary }]}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.modalBtn, { backgroundColor: colors.accent }]} onPress={saveEdit}>
                <Text style={[styles.modalBtnText, { color: '#fff' }]}>Save</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    scroll: { flex: 1 },
    container: { paddingTop: 56, paddingHorizontal: 18, paddingBottom: 48 },

    heading: { fontSize: 30, fontWeight: '900', color: colors.textPrimary, marginBottom: 18 },

    // Avatar card
    avatarCard: {
      borderRadius: 20,
      borderWidth: 1,
      overflow: 'hidden',
      alignItems: 'center',
      paddingBottom: 20,
      marginBottom: 14,
    },
    avatarBand: { width: '100%', height: 56, marginBottom: -28 },
    editIconBtn: {
      position: 'absolute',
      top: 12,
      right: 12,
      width: 34,
      height: 34,
      borderRadius: 10,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2,
    },
    avatarCircle: {
      width: 72,
      height: 72,
      borderRadius: 36,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
      borderWidth: 3,
    },
    avatarInitials: { fontSize: 26, fontWeight: '900', color: '#fff' },
    profileName: { fontSize: 20, fontWeight: '900' },
    profileBio: {
      marginTop: 4,
      fontSize: 13,
      fontWeight: '600',
      textAlign: 'center',
      paddingHorizontal: 24,
    },

    miniStatsRow: {
      flexDirection: 'row',
      marginTop: 16,
      paddingHorizontal: 24,
      alignItems: 'center',
      width: '100%',
      justifyContent: 'center',
    },
    miniStat: { flex: 1, alignItems: 'center' },
    miniStatVal: { fontSize: 22, fontWeight: '900' },
    miniStatLabel: { marginTop: 2, fontSize: 12, fontWeight: '700' },
    miniStatDivider: { width: 1, height: 32, marginHorizontal: 8 },

    // Progress
    progressCard: {
      borderRadius: 18,
      borderWidth: 1,
      padding: 16,
      marginBottom: 22,
    },
    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    progressTitle: { fontSize: 15, fontWeight: '800' },
    progressPct: { fontSize: 15, fontWeight: '900' },
    progressTrack: { height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
    progressFill: { height: '100%', borderRadius: 4 },
    progressSub: { fontSize: 12, fontWeight: '700' },

    sectionLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1.4, marginBottom: 10 },

    // Settings list
    settingsCard: { borderRadius: 18, borderWidth: 1, overflow: 'hidden', marginBottom: 28 },
    settingsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 14,
      gap: 12,
    },
    settingsIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    settingsLabel: { flex: 1, fontWeight: '800', fontSize: 15 },
    settingsRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    settingsValue: { fontSize: 13, fontWeight: '700' },

    footer: { textAlign: 'center', fontWeight: '700', fontSize: 12, marginTop: 4 },

    // Modal
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.35)',
      justifyContent: 'center',
      paddingHorizontal: 18,
    },
    modalCard: { borderRadius: 18, padding: 18, borderWidth: 1 },
    modalTitle: { fontSize: 18, fontWeight: '900', marginBottom: 14 },
    inputLabel: { fontSize: 12, fontWeight: '800', marginBottom: 6, marginTop: 10 },
    input: {
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 11,
      fontWeight: '700',
      fontSize: 15,
    },
    modalRow: { flexDirection: 'row', gap: 10, marginTop: 16, justifyContent: 'flex-end' },
    modalBtn: { paddingVertical: 11, paddingHorizontal: 18, borderRadius: 12 },
    modalBtnText: { fontWeight: '900', fontSize: 14 },
  });
}