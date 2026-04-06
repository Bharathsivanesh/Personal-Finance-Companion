import { auth, db } from "@/src/services/firebase/Config";
import { createUserWithEmailAndPassword,signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { createUserModel } from "@/src/models/userModel";



export const signupservice = async (form) => {
  try {
    // 1. Create Auth user
    const userCred = await createUserWithEmailAndPassword(
      auth,
      form.email,
      form.password
    );

    const user = userCred.user;

    // 2. Create user data model
    const userData = createUserModel({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      provider: "email",
    });

    // 3. Store in Firestore
    await setDoc(doc(db, "users", user.uid), userData);

    return user;
  } catch (error) {
    throw error;
  }
};



export const loginservice = async (email, password) => {
  try {
    const userCred = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return userCred.user;
  } catch (error) {
    throw error;
  }
};