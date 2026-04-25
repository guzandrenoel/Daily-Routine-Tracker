import { Audio } from 'expo-av';

let audioModeReady = false;
let introSound = null;
let nightModeSound = null;

async function ensureAudioMode() {
  if (audioModeReady) {
    return;
  }

  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    staysActiveInBackground: false,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false,
  });

  audioModeReady = true;
}

async function ensureIntroSound() {
  if (!introSound) {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/SoundAssets/intro sound.mp3'),
      { shouldPlay: false, isLooping: false, volume: 1 }
    );
    introSound = sound;
  }

  return introSound;
}

async function ensureNightModeSound() {
  if (!nightModeSound) {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/SoundAssets/nigntmode.mp3'),
      { shouldPlay: false, isLooping: false, volume: 0.35 }
    );
    nightModeSound = sound;
  }

  return nightModeSound;
}

export async function playIntroSound() {
  try {
    await ensureAudioMode();
    const sound = await ensureIntroSound();
    await sound.setPositionAsync(0);
    await sound.playAsync();
  } catch {
    // Ignore audio playback failures to keep UI responsive.
  }
}

export async function stopIntroSound() {
  try {
    if (!introSound) {
      return;
    }

    const status = await introSound.getStatusAsync();
    if (status.isLoaded && status.isPlaying) {
      await introSound.stopAsync();
    }
  } catch {
    // Ignore audio stop failures.
  }
}

export async function playNightModeSound() {
  try {
    await ensureAudioMode();
    const sound = await ensureNightModeSound();
    await sound.setPositionAsync(0);
    await sound.playAsync();
  } catch {
    // Ignore audio playback failures to keep taps responsive.
  }
}
