interface AuthConfig {
  CLIENT_ID: string;
  CLIENT_DOMAIN: string;
  CLIENT_SECRET: string;
  AUDIENCE: string;
  REDIRECT: string;
  SCOPE: string;
}

export const AUTH_CONFIG: AuthConfig = {
  CLIENT_ID: 'I33YIQTMcuukrwaT6CrNPOkWOWCKcGPz',
  CLIENT_DOMAIN: 'rbellon.eu.auth0.com',
  CLIENT_SECRET: 'tcwbIgQ5xBOXIDlspX3qge5pE-JXFlDg70EC3oWVv534e2aCNyBFQFkBeawsD5Fa',
  AUDIENCE: 'https://rbellon.eu.auth0.com/api/v2/',
  REDIRECT: 'http://www.strong-commerce.tk/callback',
  SCOPE: 'openid'
};
