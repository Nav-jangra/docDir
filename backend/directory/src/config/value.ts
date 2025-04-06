export const value = {
  APPLICATION_PORT: process.env.APPLICATION_PORT || 3000,
  NAME: process.env.Product || 'local',
  jwt: {
    secret: process.env.JWT_SECRET || 'Wai3MWuaJb9QHJjCFzFosB6H2bKUflvmw2yMirxr',
    sessionDuration: process.env.JWT_SESSION_DURATION || '1d'
  },
  database: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    logging: Boolean(process.env.DB_LOGGING) || true,
    synchronize: Boolean(process.env.DB_SYNC) || false,
  }
};
