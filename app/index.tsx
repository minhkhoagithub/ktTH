import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import HomeScreen from "./screens/Home";

export default function Index() {
  return (
     <SafeAreaProvider>
      <HomeScreen />
    </SafeAreaProvider>
  );
}
