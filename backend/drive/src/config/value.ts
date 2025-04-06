export const value = {
  APPLICATION_PORT: process.env.APPLICATION_PORT,
  NAME: process.env.Product,
  database: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    logging: Boolean(process.env.DB_LOGGING) || true,
    synchronize: Boolean(process.env.DB_SYNC) || true,
  },
  storage: {
    providers: {
      awsS3: {
        accessKeyId: process.env.AWS_S3_ACCESSKEYID,
        secretAccessKey: process.env.AWS_S3_SECRETACCESSKEY,
        bucketName: process.env.AWS_S3_BUCKETNAME,
        region: process.env.AWS_S3_REGIONNAME,
        ttl: Number(process.env.AWS_S3_DEFAULT_TTL),
      }
    }
  }
};
