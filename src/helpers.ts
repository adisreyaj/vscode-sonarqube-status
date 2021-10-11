var fs = require("fs");

export type Data = {
  project?: string;
  sonarURL: string;
  username: string;
  password: string;
};

export function createNewFile(rootpath: string | undefined): Promise<Data> {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(`${rootpath}/.vscode`)) {
      fs.appendFile(
        `${rootpath}/.vscode/project.json`,
        `{"project":"<your-key-here>", "sonarURL": "<your-sonar-url>", "username": "<your-sonar-username>", "password": "<your-sonar-password>"}`,
        (err: any, data: any) => {
          if (err) {
            reject(err);
          }
          resolve(data);
        }
      );
    } else {
      fs.mkdirSync(`${rootpath}/.vscode`);
      fs.appendFile(
        `${rootpath}/.vscode/project.json`,
        `{"project":"<your-key-here>", "sonarURL": "<your-sonar-url>", "username": "<your-sonar-username>", "password": "<your-sonar-password>"}`,
        (err: any, data: any) => {
          if (err) {
            reject(err);
          }
          resolve(data);
        }
      );
    }
  });
}

export function readFile(rootpath: string | undefined): Promise<Data> {
  return new Promise((resolve, reject) => {
    fs.readFile(
      `${rootpath}/.vscode/project.json`,
      "utf8",
      (err: any, data: any) => {
        if (err) {
          reject(err);
        } else {
          const obj = JSON.parse(data);
          resolve(obj);
        }
      }
    );
  });
}
