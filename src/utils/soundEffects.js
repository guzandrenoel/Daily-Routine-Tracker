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

async function loadSoundOnce(currentSound, file, options) {
  if (currentSound) return currentSound;
  const { sound } = await Audio.Sound.createAsync(file, options);
  return sound;
}

export async function playIntroSound() {
  try {
    await ensureAudioMode();
    introSound = await loadSoundOnce(
      introSound,
      require('../../assets/SoundAssets/intro_sound.mp3'),
      { shouldPlay: false, isLooping: false, volume: 1 }
    );
    await introSound.setPositionAsync(0);
    await introSound.playAsync();
  } catch {}
}

export async function stopIntroSound() {
  try {
    if (!introSound) return;
    const status = await introSound.getStatusAsync();
    if (status.isLoaded && status.isPlaying) {
      await introSound.stopAsync();
    }
  } catch {}
}

export async function playNightModeSound() {
  try {
    await ensureAudioMode();
    nightModeSound = await loadSoundOnce(
      nightModeSound,
      require('../../assets/SoundAssets/nightmode.mp3'),
      { shouldPlay: false, isLooping: false, volume: 0.35 }
    );
    await nightModeSound.setPositionAsync(0);
    await nightModeSound.playAsync();
  } catch {}
}

export async function playClickSound() {
  try {
    await ensureAudioMode();
    clickSound = await loadSoundOnce(
      clickSound,
      require('../../assets/SoundAssets/on_click_sound.mp3'),
      { shouldPlay: false, isLooping: false, volume: 0.6 }
    );
    await clickSound.setPositionAsync(0);
    await clickSound.playAsync();
  } catch {}
}