export enum Env {
  production = "production",
  development = "development",
  test = "test",
}

export const initConfig = () => {
  switch (config.env) {
    case Env.production:
      console.log("Production environment");
      break;
    case Env.development:
      console.log("Development environment");
      break;
    case Env.test:
      console.log("Test environment");
      break;
    default:
      throw new Error(`Unknown environment: ${config.env}`);
  }
};

export const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  baseUrl: process.env.BASE_URL,
  mongoDB: {
    host: process.env.MONGODB_HOST,
    port: process.env.MONGODB_PORT,
    dbName: process.env.MONGODB_DB_NAME,
  },
  secrets: {
    jwt: process.env.JWT_SECRET as string,
    jwtExp: 31557600,
  },
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  bunny: {
    accessKey: process.env.BUNNY_ACCESS_KEY,
    stroageName: process.env.BUNNY_STORAGE_NAME,
    hostName: process.env.BUNNY_HOST_NAME,
  },
  discord: {
    redirectUri: process.env.DISCORD_REDIRECT_URI as string,
    clientId: process.env.DISCORD_CLIENT_ID as string,
    clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    token: process.env.DISCORD_TOKEN as string,
  },
  saltWorkFactor: 10,
};
