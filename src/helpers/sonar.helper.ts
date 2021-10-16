import * as humanize from 'humanize-duration';
import { groupBy } from 'lodash-es';
import { millify } from 'millify';
import { Client } from 'sonarqube-sdk';
import { MeasuresRequest, MeasuresResponse } from 'sonarqube-sdk/interfaces';
import * as vscode from 'vscode';
import { METRICS_TO_FETCH, RATING_VALUE_MAP } from '../data/constants';
import { Config } from '../interfaces/config.interface';

let client: Client | null = null;

export const sonarSDKClient = (config: Config) => {
  if (client) {
    return client;
  } else {
    try {
      client = new Client({ url: config.sonarURL, auth: config.auth });
      return client;
    } catch (error: any) {
      vscode.window.showErrorMessage(error?.message);
    }
  }
};
export async function getMetrics(config: Config) {
  try {
    const client = sonarSDKClient(config);
    if (client) {
      const data = await client.measures.component({
        component: config.project,
        additionalFields: [MeasuresRequest.MeasuresRequestAdditionalField.metrics],
        metricKeys: METRICS_TO_FETCH,
      });
      if (data && data.metrics) {
        return parseResponse(data.component.measures, data?.metrics);
      }
    }
  } catch (error) {
    console.error(error);
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
  const type = opts.type;
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
