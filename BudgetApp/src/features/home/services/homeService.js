import { auth, db } from "@/src/services/firebase/Config";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";

export const getHomeDataservice = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

    const userId = user.uid;

    // ✅ 1. Get user data
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    const userData = userSnap.exists() ? userSnap.data() : {};

    // ✅ 2. Get recent 3 transactions
    const q = query(
      collection(db, "transactions"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(3),
    );

    const snap = await getDocs(q);

    const transactions = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      user: userData,
      transactions,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
