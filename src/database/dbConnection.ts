import mongoose, { type ConnectOptions } from 'mongoose';

export default async () => {
  await mongoose.connect(process.env.MONGOOSE_URI as string, {
    retryWrites: true,
  } as ConnectOptions);

  console.log('Connected to database');
};

mongoose.set('strictQuery', false);
