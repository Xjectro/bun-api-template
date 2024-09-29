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

interface ConnectionModel extends mongoose.Model<ConnectionType> {
  save({ ...state }: {}): Promise<boolean>
}

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
      type: {
        id: String,
        name: String,
        username: String,
      },
      required: true,
    },
  },
  { timestamps: true, versionKey: false, _id: false },
);

connectionSchema.statics.save = async function saveConnection({ ...state }: ConnectionType) {
  return await Connection.updateOne(
    { user: state.user, type: state.type },
    { $set: state },
    { upsert: true },
  );
}

export const Connection = mongoose.model<ConnectionType, ConnectionModel>(
  "connection",
  connectionSchema,
);