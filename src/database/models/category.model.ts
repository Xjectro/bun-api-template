import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface CategoryType extends mongoose.Document {
  name: string;
  code: string;
  iconURL: string;
  country: string;
  subCategories: {
    name: string;
    code: string;
    iconURL: string;
    details: { name: string; code: string }[];
  }[];
}

const categorySchema = new Schema<CategoryType>(
  {
    name: String,
    code: String,
    iconURL: String,
    subCategories: Array,
  },
  { timestamps: true, versionKey: false },
);

export const Category = mongoose.model<CategoryType>('category', categorySchema);
