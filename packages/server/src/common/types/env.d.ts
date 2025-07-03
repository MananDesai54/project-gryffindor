declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT: string;
    MONGO_CONNECTION_URI: string;
    JWT_SECRET: string;
    GCS_PROJECT_ID: string;
    GCS_BUCKET_NAME: string;
    GCS_KEYFILE_PATH: string;
  }
}
