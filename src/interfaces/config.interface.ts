export interface Config {
  project: string;
  sonarURL: string;
  auth?: {
    username: string;
    password: string;
  };
}
