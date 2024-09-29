import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface TransactionType extends mongoose.Document {
  user: any;
  action: string;
  code?: string;
  ref?: string;
  expiresAt: Date;
}

const transactionSchema = new Schema<TransactionType>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'User ID is required'],
    },
    action: {
      type: String,
      required: [true, 'Action is required'],
    },
    code: String,
    ref: String,
    expiresAt: {
      type: Date,
      required: [true, 'Expiration date is required'],
    },
  },
  { timestamps: true, versionKey: false },
);

export const Transaction = mongoose.model<TransactionType>('transaction', transactionSchema);
