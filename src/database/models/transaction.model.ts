import mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface TransactionsType extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId;
  action: string;
  code?: string;
  ref?: string;
  expiresAt: Date;
}

const transactionSchema = new Schema<TransactionsType>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    action: {
      type: String,
      required: [true, "Action is required"],
    },
    code: String,
    ref: String,
    expiresAt: {
      type: Date,
      required: [true, "Expiration date is required"],
    },
  },
  { timestamps: true, versionKey: false },
);

export const Transaction = mongoose.model<TransactionsType>(
  "transaction",
  transactionSchema,
);
