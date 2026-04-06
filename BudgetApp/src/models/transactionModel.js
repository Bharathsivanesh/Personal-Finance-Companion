export const createTransactionModel = ({
  userId,
  type,
  amount,
  category,
  paymentMode,
  fromAccount,
  toAccount,
  notes,
  attachmentUrl,
}) => {
  return {
    userId,

    type, // expense | income | transfer
    amount: Number(amount),

    category: category || null,
    paymentMode: paymentMode || null,

    fromAccount: fromAccount || null,
    toAccount: toAccount || null,

    notes: notes || "",
    attachmentUrl: attachmentUrl || "",

    createdAt: new Date(),
  };
};