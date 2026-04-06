export const createUserModel = (data) => {
  return {
    fullName: data.fullName || "",
    email: data.email || "",
    phone: data.phone || "",

    provider: data.provider || "email",
    photoURL: data.photoURL || "",

    balance: 0,
    totalIncome: 0,
    totalExpense: 0,

    currency: "INR",
    deviceToken: "",

    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
