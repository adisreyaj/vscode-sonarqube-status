<p align="center">
  <a href="https://github.com/adisreyaj/vscode-sonarqube-status">
    <img src="https://raw.githubusercontent.com/adisreyaj/vscode-sonarqube-status/master/images/logo.png" alt="Logo" width="120" height="120">
  </a>

<h3 align="center">SonarQube Project Status</h3>
  <p align="center">VSCode extension to view SonarQube results right inside your favorite IDE - VSCode
</p>
</p>

SonarQube is a static code analyzer for your project. It makes sure your code is up to the mark and will not break in
production.

![SonarQube Status Results](https://raw.githubusercontent.com/adisreyaj/vscode-sonarqube-status/master/images/sonarqube-vscode-status.jpg)

## How to Use

1. Install the Extension and Make sure it is activated.
2. Click on the SonarQube logo on the activity bar or run the command from Command Palette:

    ```
    SonarQube: Get Report
    ```

3. This will create a `project.json` file in `.vscode` folder.
4. Make sure to add the details:


### Using Password Auth

```json
{
  "project": "adisreyaj_compito",
  "sonarURL": "https://sonarcloud.io",
  "auth": {
    "username": "",
    "password": ""
  }
}
```

### Using Token Auth

```json
{
  "project": "adisreyaj_compito",
  "sonarURL": "https://sonarcloud.io",
  "auth": {
    "token": ""
  }
}
```

### Using SonarQube pullRequest Analysis Metrics

```json
{
  "project": "adisreyaj_compito",
  "sonarURL": "https://sonarcloud.io",
  "pullRequest": 212,
  "auth": {
    "token": ""
  }
}
```

### Using SonarQube branch Analysis Metrics

```json
{
  "project": "adisreyaj_compito",
  "sonarURL": "https://sonarcloud.io",
  "branch": "bugfix/fixMe",
  "auth": {
    "token": ""
  }
}
```

| Optional property | Description |
| ----------------- | ----------- | 
| `auth`            | Its only required for private SonarQube projects. The `auth` can be done via combination of `username` and `password` or `token`. Please look at sample configuration body file described above. |
| `branch`          | It should be added if you want to collect metrics from [SonarQube branch analysis](https://docs.sonarqube.org/latest/branches/overview/) under project. |
| `pullRequest`     | It should be added if you want to collect metrics from [SonarQube pullRequest analysis](https://docs.sonarqube.org/latest/analysis/pull-request/) under project. |

5. Run the command again and you should see the report on the SonarQube section in the activity bar.

## Features

1. Status bar item added for quickly knowing the Quality Gate Status without having to click elsewhere.

![Sonarqube passed](https://raw.githubusercontent.com/adisreyaj/vscode-sonarqube-status/master/images/sonar-passed.png)

![Sonarqube failed](https://raw.githubusercontent.com/adisreyaj/vscode-sonarqube-status/master/images/sonar-failed.png)

2. Full details in the Sonarqube Dedicated section

![Sonarqube Full Result](https://raw.githubusercontent.com/adisreyaj/vscode-sonarqube-status/master/images/sonar-full-details.png)

3. Refresh button to quickly refresh the results.

## Roadmap

See the [open issues](https://github.com/adisreyaj/vscode-sonarqube-status/issues) for a list of proposed features (and
known issues).

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Show your support

Please ⭐️ this repository if this project helped you!
