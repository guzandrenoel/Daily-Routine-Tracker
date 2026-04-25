import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import AuthScreen from './auth/AuthScreen';
import TabNavigator from './tabs/TabNavigator';
import styles from './styles/AppStyles';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState(null);

  const splashOpacity = useRef(new Animated.Value(0)).current;
  const splashScale = useRef(new Animated.Value(0.96)).current;
  const splashTranslateY = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(splashOpacity, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(splashScale, { toValue: 1, useNativeDriver: true }),
      Animated.spring(splashTranslateY, { toValue: 0, useNativeDriver: true }),
    ]).start();
  }, []);

  if (showSplash) {
    return (
      <Pressable style={styles.splashContainer} onPress={() => setShowSplash(false)}>
        <StatusBar style="dark" />
        <View style={styles.glowTopLeft} />
        <View style={styles.glowBottomRight} />

        <Animated.View
          style={[
            styles.centerContent,
            { opacity: splashOpacity, transform: [{ scale: splashScale }, { translateY: splashTranslateY }] },
          ]}
        >
          <View style={styles.heroBlock}>
            <View style={styles.logoCard}>
              <Image source={require('./assets/App_Logo.png')} style={styles.logo} resizeMode="contain" />
            </View>

            <Text style={styles.brand}>DayFlow</Text>
            <Text style={styles.description}>Plan. Track. Progress.</Text>
          </View>

          <Text style={styles.tapToEnter}>Tap anywhere to continue</Text>
        </Animated.View>
      </Pressable>
    );
  }

  if (!user) {
    return <AuthScreen onAuth={setUser} />;
  }

  return (
    <>
      <TabNavigator user={user} onLogout={() => setUser(null)} />
      <StatusBar style="auto" />
    </>
  );
}