interface AuthConfig {
  token?: string;
  username?: string;
  password?: string;
}

export interface Config {
  project: string;
  sonarURL: string;
  auth?: AuthConfig;
}
