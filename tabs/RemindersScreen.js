import { StyleSheet, Text, View } from 'react-native';

export default function RemindersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Reminders</Text>
      <Text style={styles.subtext}>Set and manage reminders for your routines.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
  },
});
