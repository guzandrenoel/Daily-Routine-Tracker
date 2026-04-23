import { StatusBar } from 'expo-status-bar';
import TabNavigator from './tabs/TabNavigator';

export default function App() {
  return (
    <>
      <TabNavigator />
      <StatusBar style="auto" />
    </>
  );
}
