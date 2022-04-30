export const VSCODE_PROJECT_CONFIG = {
  _comment:
    'The authentication can be proceed in two ways. Using combination of username and password or token. The project.json which contains two of them at once is invalid.',
  project: '<your-key-here>',
  sonarURL: '<your-sonar-url>',
  auth: {
    username: '<sonar-username>',
    password: '<sonar-password>',
  },
};

export const VSCODE_PROJECT_JSON_FORMAT_OPTIONS = {
  spaces: 4,
  EOL: '\n',
};

export const COMMANDS = {
  getStatus: 'sonarqubeStatus.get',
  refresh: 'sonarqubeStatus.refresh',
};

export const METRICS_TO_FETCH = [
  'bugs',
  'coverage',
  'code_smells',
  'alert_status',
  'vulnerabilities',
  'cognitive_complexity',
  'security_review_rating',
  'security_hotspots',
  'critical_violations',
  'duplicated_blocks',
  'sqale_index',
  'sqale_rating',
  'ncloc',
  'duplicated_lines_density',
];

export const RATING_VALUE_MAP: Record<number, string> = {
  1: 'A',
  2: 'B',
  3: 'C',
  4: 'D',
  5: 'E',
};
