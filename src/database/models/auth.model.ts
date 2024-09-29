import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

export enum Role {
  ADMIN = "ADMIN",
  STAFF = "STAFF",
  USER = "USER",
}

export interface AuthType extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  user: any;
  refresh_token: string;
  email: string;
  password: string;
  role: Role;
  tfa: boolean;
  comparePassword: (password: string) => Promise<boolean>;
}

interface AuthModel extends mongoose.Model<AuthType> {
  checkEmail(email: string): Promise<boolean>;
}

const authSchema: mongoose.Schema<AuthType> = new Schema<AuthType>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    refresh_token: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      match: /.+@.+\..+/,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    password: {
      type: String,
      required: true,
    },
    tfa: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false },
);

authSchema.pre<AuthType>("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

authSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, this.password);
  } catch {
    return false;
  }
};

authSchema.statics.checkEmail = async function (
  email: string,
): Promise<boolean> {
  return !!(await Auth.findOne({ email }));
};

export const Auth = mongoose.model<AuthType, AuthModel>("auth", authSchema);