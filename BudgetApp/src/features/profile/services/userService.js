import { auth, db } from "@/src/services/firebase/Config";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ GET PROFILE
export const getUserProfile = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return { id: snap.id, ...snap.data() };
  } catch (e) {
    console.log("GET PROFILE ERROR:", e);
    return null;
  }
};

// ✅ UPDATE PROFILE
export const updateUserProfile = async (data) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

    const ref = doc(db, "users", user.uid);

    await updateDoc(ref, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    return true;
  } catch (e) {
    console.log("UPDATE PROFILE ERROR:", e);
    return false;
  }
};

export const logoutService = async () => {
  try {
    // 1. Firebase logout
    await signOut(auth);

    // 2. Clear local storage
    await AsyncStorage.clear();
    // OR better (if you store specific keys)
    // await AsyncStorage.removeItem("user");

    return true;
  } catch (error) {
    throw error;
  }
};
