const getConfig = () => {
  return {
    PG_DB: {
      DATABASE: process.env.DB_DATABASE ?? '',
      USERNAME: process.env.DB_USERNAME ?? '',
      PASSWORD: process.env.DB_PASSWORD ?? '',
      HOST: process.env.DB_HOST,
      PORT: Number(process.env.DB_PORT) ?? 18983,
    },
    SAML: {
      CALLBACK_URL: process.env.CALLBACK_URL,
      ENTRY_POINT: process.env.ENTRY_POINT,
      ISSUER: process.env.ISSUER,
      IDP_LOGOUT_URL: process.env.IDP_LOGOUT_URL,
      SP_LOGOUT_CALLBACK: process.env.SP_LOGOUT_CALLBACK,
      IPD_CERT: process.env.IDP_CERT,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    },
    FRONTEND: {
      AUTH_REDIRECT_URL: process.env.AUTH_REDIRECT_URL || 'http://localhost:3001',
    },
    SECRET_KEY: process.env.JWT_SECRET_KEY || 'TOP_SECRET',
    TOKEN_MAX_AGE_VALUE_IN_HOURS: process.env.TOKEN_MAX_AGE_VALUE_IN_HOURS || '10',
    TOKEN_EXPIRATION: process.env.JWT_TOKEN_EXPIRATION || '10h',
    AUTHENTICATION_KEY: process.env.AUTHENTICATION_KEY || 'W08Vzk7EjI5IBTmptljmx97qxXQgGgDu',
    SIGN_UP_ROLE_ID: process.env.SIGN_UP_ROLE_ID,
  };
};

export default getConfig;
