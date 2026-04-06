import { useEffect } from "react";
import { router } from "expo-router";
import SplashScreen from "../src/features/splash/screens/SplashScreen";
import { useAuth } from "@/src/context/AuthContext";

export default function Page() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return; // wait for auth to load

    setTimeout(() => {
      if (user) {
        router.replace("/(tabs)"); // logged in
      } else {
        router.replace("/(auth)/login"); // not logged in
      }
    }, 4000);
  }, [loading]);

  return <SplashScreen />;
}
