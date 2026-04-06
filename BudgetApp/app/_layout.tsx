import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../global.css";
import "react-native-reanimated";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthProvider } from "@/src/context/AuthContext";
import { ToastProvider } from "@/src/components/ui/Toast";
import Toast from "react-native-toast-message";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <AuthProvider>
      {" "}
      {/* ✅ WRAP Context Provider */}
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <ToastProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          </Stack>
        </ToastProvider>
        <StatusBar style="auto" />
      </ThemeProvider>
      <Toast />
    </AuthProvider>
  );
}
