import * as humanize from 'humanize-duration';
import { groupBy } from 'lodash-es';
import { millify } from 'millify';
import { Client, MeasuresRequest, MeasuresResponse, SonarQubeSDKAuth } from 'sonarqube-sdk';
import * as vscode from 'vscode';
import { METRICS_TO_FETCH, RATING_VALUE_MAP } from '../data/constants';
import { Config } from '../interfaces/config.interface';
import { isConfigured, isPullRequestOrBranchConfigured } from './file.helpers';

let client: Client | null = null;

export const sonarSDKClient = (config: Config) => {
  if (client) {
    return client;
  }
  const { isConfigured: configured, authType } = isConfigured(config);
  if (!configured) {
    throw new Error('Not configured');
  }

  const getAuthConfig: Record<string, () => SonarQubeSDKAuth | null> = {
    token: () =>
      config.auth?.token
        ? {
            type: 'token',
            token: config.auth?.token,
          }
        : null,
    password: () =>
      config.auth?.username && config.auth?.password
        ? {
            type: 'password',
            username: config.auth?.username,
            password: config.auth?.password,
          }
        : null,
  };

  const auth = getAuthConfig[authType]();
  if (!auth) {
    throw new Error('Auth not configured');
  }
  try {
    client = new Client({ url: config.sonarURL, auth });
    return client;
  } catch (error: any) {
    vscode.window.showErrorMessage(error?.message);
    return null;
  }
};

export async function getMetrics(config: Config) {
  try {
    const sonarClient = sonarSDKClient(config);

    if (sonarClient) {
      // Collect pullRequest or branch configuration
      const branchOrPullRequest = isPullRequestOrBranchConfigured(config);

      const inputData = {
        component: config.project,
        additionalFields: [MeasuresRequest.MeasuresRequestAdditionalField.metrics],
        metricKeys: METRICS_TO_FETCH,
      };

      const data = await sonarClient.measures.component({...inputData, ...branchOrPullRequest});
      if (data && data.metrics) {
        return parseResponse(data.component.measures, data?.metrics);
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}

function parseResponse(
  measures: MeasuresResponse.ComponentBaseMeasures[],
  metrics: MeasuresResponse.ComponentMetric[]
) {
  const metricsMeta: Record<string, any> = metrics.reduce(
    (acc, curr) => ({ ...acc, [curr.key]: curr }),
    {}
  );
  const dataFormatted = measures.map((item) => ({
    meta: metricsMeta[item.metric],
    label: metricsMeta[item.metric].name,
    type: metricsMeta[item.metric].type,
    domain: metricsMeta[item.metric].domain,
    value: addFormatting(item.value, metricsMeta[item.metric]),
  }));

  const grouped = groupBy(dataFormatted, 'domain');
  return grouped;
}

function addFormatting(value: string | undefined, opts: any) {
  if (!value) {
    return null;
  }
  const { type } = opts;
  switch (type) {
    case 'INT':
      return millify(+value);
    case 'PERCENT':
      return `${value} %`;
    case 'WORK_DUR':
      return humanize(+value * 60000, { largest: 1 });
    case 'RATING':
      return RATING_VALUE_MAP[+value];
    case 'LEVEL':
      return value;
    default:
      return value;
  }
}
