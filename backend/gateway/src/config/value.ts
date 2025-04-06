export const value = {
  port: Number(process.env.APPLICATION_PORT || 3000),
  jwt_secret:
    process.env.JWT_SECRET,
  provider: {
    directory: {
      url: process.env.DIRECTORY_ENDPOINT || 'http://localhost:5000',
    },
    drive: {
      url: process.env.DRIVE_ENDPOINT || 'http://localhost:4000',
    }
  },
  database: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    synchronize: process.env.DB_SYNC || false,
    logging: process.env.DB_LOG ?? true,
  }
};
