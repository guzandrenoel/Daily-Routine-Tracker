// App.js
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import TabNavigator from './tabs/TabNavigator';
import AuthScreen from './auth/AuthScreen';

import createAppStyles from './styles/AppStyles';
import { lightTheme } from './styles/theme';

import { playIntroSound, stopIntroSound, playNightModeSound } from './utils/soundEffects';

export default function App() {
  const styles = useMemo(() => createAppStyles(lightTheme.colors), []);
  const [showSplash, setShowSplash] = useState(true);

  // ✅ GLOBAL THEME STATE
  const [isDarkMode, setIsDarkMode] = useState(false);

  // ✅ AUTH STATE (brings login back)
  const [user, setUser] = useState(null);

  const [taglineWidth, setTaglineWidth] = useState(0);
  const splashOpacity = useRef(new Animated.Value(0)).current;
  const splashScale = useRef(new Animated.Value(0.96)).current;
  const splashTranslateY = useRef(new Animated.Value(18)).current;
  const descriptionOpacity = useRef(new Animated.Value(0)).current;
  const descriptionTranslateY = useRef(new Animated.Value(12)).current;
  const descriptionTwoOpacity = useRef(new Animated.Value(0)).current;
  const descriptionTwoTranslateY = useRef(new Animated.Value(12)).current;
  const accentTravel = useRef(new Animated.Value(0)).current;

  const handleSplashPress = () => {
    setShowSplash(false);
    stopIntroSound();
  };

  const handleToggleTheme = async () => {
    setIsDarkMode((v) => !v);
    await playNightModeSound();
  };

  const handleAuth = (u) => setUser(u);
  const handleLogout = () => setUser(null);

  useEffect(() => {
    playIntroSound();

    Animated.parallel([
      Animated.spring(splashOpacity, {
        toValue: 1,
        useNativeDriver: true,
        friction: 9,
        tension: 55,
      }),
      Animated.spring(splashScale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
        tension: 50,
      }),
      Animated.spring(splashTranslateY, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
        tension: 55,
      }),
    ]).start();

    const descriptionTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(descriptionOpacity, {
          toValue: 1,
          duration: 420,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(descriptionTranslateY, {
          toValue: 0,
          useNativeDriver: true,
          friction: 8,
          tension: 50,
        }),
      ]).start();
    }, 780);

    const descriptionTwoTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(descriptionTwoOpacity, {
          toValue: 1,
          duration: 420,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(descriptionTwoTranslateY, {
          toValue: 0,
          useNativeDriver: true,
          friction: 8,
          tension: 50,
        }),
      ]).start();
    }, 1780);

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

    return () => {
      clearTimeout(descriptionTimer);
      clearTimeout(descriptionTwoTimer);
      loop.stop();
    };
  }, []);

  const travelTranslateX = accentTravel.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.max(taglineWidth - 96, 0)],
  });

  if (showSplash) {
    return (
      <Pressable style={styles.splashContainer} onPress={handleSplashPress}>
        <Animated.View
          style={[
            styles.centerContent,
            {
              opacity: splashOpacity,
              transform: [{ scale: splashScale }, { translateY: splashTranslateY }],
            },
          ]}
        >
          <View style={styles.heroBlock}>
            <View style={styles.logoCard}>
              <Animated.View style={styles.logoPulse} />
              <Image source={require('./assets/App_Logo.png')} style={styles.logo} resizeMode="contain" />
            </View>

            <Text style={styles.brand}>DayFlow</Text>

            <View style={styles.taglineWrap} onLayout={(e) => setTaglineWidth(e.nativeEvent.layout.width)}>
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.taglineAccent,
                  { opacity: taglineWidth ? 1 : 0, transform: [{ translateX: travelTranslateX }] },
                ]}
              />
              <View style={styles.taglineWordsRow}>
                <Text style={styles.taglineWord}>PLAN.</Text>
                <Text style={styles.taglineWord}>TRACK.</Text>
                <Text style={styles.taglineWord}>PROGRESS.</Text>
              </View>
            </View>

            <View style={styles.dividerTrack} />

            <Animated.Text
              style={[
                styles.description,
                styles.descriptionDelayed,
                { opacity: descriptionOpacity, transform: [{ translateY: descriptionTranslateY }] },
              ]}
            >
              Create consistent routines.
            </Animated.Text>

            <Animated.Text
              style={[
                styles.description,
                styles.descriptionLater,
                { opacity: descriptionTwoOpacity, transform: [{ translateY: descriptionTwoTranslateY }] },
              ]}
            >
              Live a better life.
            </Animated.Text>
          </View>

          <Text style={styles.tapToEnter}>Tap anywhere to continue</Text>
        </Animated.View>
      </Pressable>
    );
  }

  // ✅ AUTH FIRST, THEN APP
  if (!user) {
    return (
      <>
        <AuthScreen onAuth={handleAuth} />
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      </>
    );
  }

  return (
    <>
      <TabNavigator
        user={user}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
      />
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
    </>
  );
}