import { useMemo, useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import createAppStyles from '../styles/AppStyles';
import { lightTheme } from '../styles/theme';

export default function AuthScreen({ onAuth }) {
  // Use the same style system as the splash (same colors + look)
  const splashStyles = useMemo(() => createAppStyles(lightTheme.colors), []);

  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Small entrance animation so it feels like the splash
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslate = useRef(new Animated.Value(16)).current;

  const [taglineWidth, setTaglineWidth] = useState(0);
  const accentTravel = useRef(new Animated.Value(0)).current;

  // run once
  useMemo(() => {
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(cardTranslate, {
        toValue: 0,
        friction: 8,
        tension: 55,
        useNativeDriver: true,
      }),
    ]).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(accentTravel, {
          toValue: 1,
          duration: 2100,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(accentTravel, {
          toValue: 0,
          duration: 2100,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, []);

  const travelTranslateX = accentTravel.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.max(taglineWidth - 96, 0)],
  });

  const canSubmit = username.trim().length > 0 && password.length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;

    // Local auth only (no DB yet)
    onAuth?.({
      username: username.trim(),
    });
  };

  return (
    <View style={splashStyles.splashContainer}>
      {/* Soft background accents (same vibe as splash) */}
      <View style={styles.bgAccentTopLeft} />
      <View style={styles.bgAccentBottomRight} />

      <View style={styles.centerWrap}>
        {/* Brand block (same as splash) */}
        <View style={styles.heroBlock}>
          <View style={splashStyles.logoCard}>
            <Animated.View style={splashStyles.logoPulse} />
            <Image
              source={require('../assets/App_Logo.png')}
              style={splashStyles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={splashStyles.brand}>DayFlow</Text>

          <View style={splashStyles.taglineWrap} onLayout={(e) => setTaglineWidth(e.nativeEvent.layout.width)}>
            <Animated.View
              pointerEvents="none"
              style={[
                splashStyles.taglineAccent,
                { opacity: taglineWidth ? 1 : 0, transform: [{ translateX: travelTranslateX }] },
              ]}
            />
            <View style={splashStyles.taglineWordsRow}>
              <Text style={splashStyles.taglineWord}>PLAN.</Text>
              <Text style={splashStyles.taglineWord}>TRACK.</Text>
              <Text style={splashStyles.taglineWord}>PROGRESS.</Text>
            </View>
          </View>
        </View>

        {/* Auth Card */}
        <Animated.View
          style={[
            styles.card,
            {
              opacity: cardOpacity,
              transform: [{ translateY: cardTranslate }],
            },
          ]}
        >
          <Text style={styles.cardTitle}>{mode === 'login' ? 'Login' : 'Sign Up'}</Text>

          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            style={styles.input}
          />

          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            style={styles.input}
          />

          <Pressable
            onPress={handleSubmit}
            disabled={!canSubmit}
            style={[styles.primaryBtn, !canSubmit && styles.primaryBtnDisabled]}
          >
            <Text style={styles.primaryBtnText}>{mode === 'login' ? 'Login' : 'Create Account'}</Text>
          </Pressable>

          <Pressable
            onPress={() => setMode((m) => (m === 'login' ? 'signup' : 'login'))}
            style={styles.linkWrap}
          >
            <Text style={styles.link}>
              {mode === 'login' ? 'No account? Sign up' : 'Already have an account? Login'}
            </Text>
          </Pressable>

          <Text style={styles.helper}>Local login only (no database yet).</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centerWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  heroBlock: {
    alignItems: 'center',
    marginBottom: 18,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 12,
    color: '#0F172A',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.12)',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
    marginBottom: 12,
  },
  primaryBtn: {
    backgroundColor: '#18A6A0',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryBtnDisabled: {
    opacity: 0.45,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
  },
  linkWrap: {
    marginTop: 12,
    alignItems: 'center',
  },
  link: {
    color: '#18A6A0',
    fontWeight: '800',
  },
  helper: {
    marginTop: 10,
    textAlign: 'center',
    color: 'rgba(15, 23, 42, 0.55)',
    fontWeight: '700',
  },

  // soft blobs (simple + lightweight)
  bgAccentTopLeft: {
    position: 'absolute',
    top: -80,
    left: -90,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(24, 166, 160, 0.10)',
  },
  bgAccentBottomRight: {
    position: 'absolute',
    bottom: -90,
    right: -90,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(24, 166, 160, 0.08)',
  },
});