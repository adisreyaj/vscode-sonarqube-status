export const VSCODE_PROJECT_CONFIG = {
  project: '<your-key-here>',
  sonarURL: '<your-sonar-url>',
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
