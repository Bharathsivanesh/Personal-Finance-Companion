// src/features/transaction/services/transactionService.js
import { auth, db } from "@/src/services/firebase/Config";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  increment,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { createTransactionModel } from "@/src/models/transactionModel";

export const addTransactionservice = async (data) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

    const userId = user.uid;

    const transaction = createTransactionModel({ userId, ...data });
    await addDoc(collection(db, "transactions"), transaction);

    const userRef = doc(db, "users", userId);

    if (data.type === "expense") {
      await updateDoc(userRef, {
        balance: increment(-Number(data.amount)),
        totalExpense: increment(Number(data.amount)),
      });
    }

    if (data.type === "income") {
      await updateDoc(userRef, {
        balance: increment(Number(data.amount)),
        totalIncome: increment(Number(data.amount)),
      });
    }

    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getTransactionsservice = async ({ userId }) => {
  try {
    const q = query(
      collection(db, "transactions"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    );

    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((doc) => {
      const d = doc.data();
      const dateObj = d.createdAt?.toDate();

      // ✅ local date — avoids UTC shift bug in IST
      const localDate = dateObj
        ? `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`
        : null;

      return {
        id: doc.id,
        ...d,
        date: localDate,
        time: dateObj?.toLocaleTimeString("en-IN"),
      };
    });

    return data;
  } catch (error) {
    console.log("GET TX ERROR:", error);
    return [];
  }
};

export const updateTransactionservice = async (transactionId, newData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

    const txRef = doc(db, "transactions", transactionId);
    const txSnap = await getDoc(txRef);
    if (!txSnap.exists()) throw new Error("Transaction not found");

    const old = txSnap.data();
    const userRef = doc(db, "users", user.uid);

    if (old.type === "expense") {
      await updateDoc(userRef, {
        balance: increment(Number(old.amount)),
        totalExpense: increment(-Number(old.amount)),
      });
    } else if (old.type === "income") {
      await updateDoc(userRef, {
        balance: increment(-Number(old.amount)),
        totalIncome: increment(-Number(old.amount)),
      });
    }

    if (newData.type === "expense") {
      await updateDoc(userRef, {
        balance: increment(-Number(newData.amount)),
        totalExpense: increment(Number(newData.amount)),
      });
    } else if (newData.type === "income") {
      await updateDoc(userRef, {
        balance: increment(Number(newData.amount)),
        totalIncome: increment(Number(newData.amount)),
      });
    }

    await updateDoc(txRef, {
      type: newData.type,
      amount: Number(newData.amount),
      category: newData.category || null,
      paymentMode: newData.paymentMode || null,
      notes: newData.notes || "",
      attachmentUrl: newData.attachmentUrl || "",
      updatedAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.log("UPDATE TX ERROR:", error);
    throw error;
  }
};

export const deleteTransactionservice = async (transactionId) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

    const txRef = doc(db, "transactions", transactionId);
    const txSnap = await getDoc(txRef);
    if (!txSnap.exists()) throw new Error("Transaction not found");

    const tx = txSnap.data();
    const userRef = doc(db, "users", user.uid);

    if (tx.type === "expense") {
      await updateDoc(userRef, {
        balance: increment(Number(tx.amount)),
        totalExpense: increment(-Number(tx.amount)),
      });
    } else if (tx.type === "income") {
      await updateDoc(userRef, {
        balance: increment(-Number(tx.amount)),
        totalIncome: increment(-Number(tx.amount)),
      });
    }

    await deleteDoc(txRef);

    return true;
  } catch (error) {
    console.log("DELETE TX ERROR:", error);
    throw error;
  }
};
