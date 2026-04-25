import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import AuthScreen from "./auth/AuthScreen";
import TabNavigator from "./tabs/TabNavigator";

export default function App() {
  const [user, setUser] = useState(null);

  // If no user yet, show login screen
  if (!user) {
    return <AuthScreen onAuth={setUser} />;
  }

  // If logged in, show the tabs and allow logout
  return (
    <>
      <TabNavigator user={user} onLogout={() => setUser(null)} />
      <StatusBar style="auto" />
    </>
  );
}