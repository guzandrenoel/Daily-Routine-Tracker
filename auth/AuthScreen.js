import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../styles/theme';

export default function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState('login'); // login | signup
  const [savedAccount, setSavedAccount] = useState(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const submit = () => {
    const u = username.trim();
    const p = password.trim();

    if (!u || !p) return Alert.alert('Missing Info', 'Enter username and password.');

    if (mode === 'signup') {
      setSavedAccount({ username: u, password: p });
      Alert.alert('Account Created', 'Now login using your account.');
      setMode('login');
      setUsername('');
      setPassword('');
      return;
    }

    if (!savedAccount) return Alert.alert('No account yet', 'Please Sign Up first.');

    if (u === savedAccount.username && p === savedAccount.password) {
      onAuth({ username: u });
    } else {
      Alert.alert('Login failed', 'Wrong username or password.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{mode === 'login' ? 'Login' : 'Sign Up'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor={colors.mutedText}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={colors.mutedText}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable style={styles.primaryBtn} onPress={submit}>
        <Text style={styles.primaryBtnText}>{mode === 'login' ? 'Login' : 'Create Account'}</Text>
      </Pressable>

      <Pressable onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}>
        <Text style={styles.link}>
          {mode === 'login' ? 'No account? Sign up' : 'Already have an account? Login'}
        </Text>
      </Pressable>

      <Text style={styles.note}>Local login only (no database yet).</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', paddingHorizontal: 24 },
  heading: { fontSize: 28, fontWeight: '800', color: colors.textPrimary, textAlign: 'center', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 10,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  primaryBtn: { marginTop: 8, backgroundColor: colors.accent, paddingVertical: 13, borderRadius: 14, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: '900' },
  link: { marginTop: 14, textAlign: 'center', color: colors.accent, fontWeight: '800' },
  note: { marginTop: 14, color: colors.textSecondary, fontSize: 12, textAlign: 'center' },
});