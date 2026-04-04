import { useEffect } from "react";
import { router } from "expo-router";
import SplashScreen from "../src/features/splash/screens/SplashScreen";

export default function Page() {
  useEffect(() => {
    setTimeout(() => {
      router.replace("/(tabs)"); 
    }, 2000);
  }, []);

  return <SplashScreen />;
}
