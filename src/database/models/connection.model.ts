import mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface ConnectionType extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId;
  type: string;
  access_token: string;
  refresh_token: string;
  data: {
    id: string;
    name: string;
    username: string;
  };
}

const dataSchema = new Schema({
  id: String,
  name: String,
  username: String,
});

const connectionSchema = new Schema<ConnectionType>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    access_token: {
      type: String,
      required: true,
    },
    refresh_token: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    data: {
      type: dataSchema,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const Connection = mongoose.model<ConnectionType>(
  "Connection",
  connectionSchema,
);
