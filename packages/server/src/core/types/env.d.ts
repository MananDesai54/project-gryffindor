declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT: string;

    MONGO_INITDB_ROOT_USERNAME: string;
    MONGO_INITDB_ROOT_PASSWORD: string;
    MONGO_INITDB_DATABASE: string;
    MONGO_CONNECTION_URI: string;

    CHROMA_URL: string;
    CHROMA_HOST: string;
    CHROMA_PORT: string;

    KAFKA_BROKER_URL: string;

    JWT_SECRET: string;

    LANGFUSE_SECRET_KEY: string;
    LANGFUSE_PUBLIC_KEY: string;
    LANGFUSE_HOST: string;

    GCS_PROJECT_ID: string;
    GCS_BUCKET_NAME: string;
    GCS_CRED_TYPE: string;
    GCS_PRIVATE_KEY_ID: string;
    GCS_PRIVATE_KEY: string;
    GCS_CLIENT_EMAIL: string;
    GCS_CLIENT_ID: string;
    GCS_UNIVERSE_DOMAIN: string;

    OPENAI_API_KEY: string;
    GEMINI_API_KEY: string;
    ANTHROPIC_API_KEY: string;

    FIRE_CRAWL_API_KEY: string;

    RESEND_API_KEY: string;
  }
}
