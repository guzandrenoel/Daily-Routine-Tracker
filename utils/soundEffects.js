import { Audio } from 'expo-av';

let audioModeReady = false;
let introSound = null;
let nightModeSound = null;
let clickSound = null;

async function ensureAudioMode() {
  if (audioModeReady) return;

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
      require('../assets/SoundAssets/intro_sound.mp3'),
      { shouldPlay: false, isLooping: false, volume: 1 }
    );
    introSound = sound;
  }
  return introSound;
}

async function ensureNightModeSound() {
  if (!nightModeSound) {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/SoundAssets/nightmode.mp3'),
      { shouldPlay: false, isLooping: false, volume: 0.35 }
    );
    nightModeSound = sound;
  }
  return nightModeSound;
}

async function ensureClickSound() {
  if (!clickSound) {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/SoundAssets/on_click_sound.mp3'),
      { shouldPlay: false, isLooping: false, volume: 0.6 }
    );
    clickSound = sound;
  }
  return clickSound;
}

export async function playIntroSound() {
  try {
    await ensureAudioMode();
    const sound = await ensureIntroSound();
    await sound.setPositionAsync(0);
    await sound.playAsync();
  } catch {}
}

export async function stopIntroSound() {
  try {
    if (!introSound) return;
    const status = await introSound.getStatusAsync();
    if (status.isLoaded && status.isPlaying) await introSound.stopAsync();
  } catch {}
}

export async function playNightModeSound() {
  try {
    await ensureAudioMode();
    const sound = await ensureNightModeSound();
    await sound.setPositionAsync(0);
    await sound.playAsync();
  } catch {}
}

export async function playClickSound() {
  try {
    await ensureAudioMode();
    const sound = await ensureClickSound();
    await sound.setPositionAsync(0);
    await sound.playAsync();
  } catch {}
}