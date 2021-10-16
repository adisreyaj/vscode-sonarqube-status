<p align="center">
  <a href="https://github.com/adisreyaj/vscode-sonarqube-status">
    <img src="images/logo.png" alt="Logo" width="120" height="120">
  </a>

  <h3 align="center">SonarQube Project Status</h3>
  <p align="center">VSCode extension to view SonarQube results right inside your favorite IDE - VSCode
</p>
</p>

SonarQube is a static code analyzer for your project. It makes sure your code is up to the mark and will not break in production.

![SonarQube Status Results](images/sonarqube-vscode-status.jpg)

## How to Use

1. Install the Extension and Make sure it is activated.
2. Click on the SonarQube logo on the activity bar or run the command from Command Palette:

```
SonarQube: Get Report
```

3. This will create a `project.json` file in `.vscode` folder.
4. Make sure to add the details:

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

`auth` is optional property. Its only required for private SonarQube projects.

5. Run the command again and you should see the report on the SonarQube section in the activity bar.

## Features

1. Status bar item added for quickly knowing the Quality Gate Status without having to click elsewhere.

![Sonarqube passed](images/sonar-passed.png)

![Sonarqube failed](images/sonar-failed.png)

2. Full details in the Sonarqube Dedicated section

![Sonarqube Full Result](images/sonar-full-details.png)

3. Refresh button to quickly refresh the results.

## Roadmap

See the [open issues](https://github.com/adisreyaj/vscode-sonarqube-status/issues) for a list of proposed features (and known issues).

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Show your support

Please ⭐️ this repository if this project helped you!
