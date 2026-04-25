import { StyleSheet } from "react-native";

export default function createAppStyles(colors) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 56,
      paddingHorizontal: 18,
    },
    title: {
      fontSize: 26,
      fontWeight: "900",
      color: colors.textPrimary,
    },
    subtitle: {
      marginTop: 6,
      fontSize: 15,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    card: {
      marginTop: 18,
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
  });
}