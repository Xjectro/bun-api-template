export enum Env {
    production = 'production',
    development = 'development',
    test = 'test',
}

export const initConfig = () => {
    switch (config.env) {
        case Env.production:
            console.log('Production environment')
            break
        case Env.development:
            console.log('Development environment')
            break
        case Env.test:
            console.log('Test environment')
            break
        default:
            throw new Error(`Unknown environment: ${config.env}`)
    }
}

export const config = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    mongoDB: {
        host: process.env.MONGODB_HOST,
        port: process.env.MONGODB_PORT,
        dbName: process.env.MONGODB_DB_NAME,
    },
    secrets: {
        jwt: process.env.JWT_SECRET,
        jwtExp: 31557600
    },
    email: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    saltWorkFactor: 10
}