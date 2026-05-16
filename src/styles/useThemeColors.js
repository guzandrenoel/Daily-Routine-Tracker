import { useAtomValue } from 'jotai';
import { isDarkModeAtom } from '../store/atoms';
import { lightTheme, darkTheme } from './theme';

export function useThemeColors() {
  const isDarkMode = useAtomValue(isDarkModeAtom);
  return isDarkMode ? darkTheme.colors : lightTheme.colors;
}