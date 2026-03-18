import fetch from 'node-fetch';
import { CreateExperimentResponse, CreateRunRequest, CreateRunResponse, EndRunRequest, Experiment, GetExperimentResponse, LogBatchRequest, LogBatchResponse, Param, Metric } from './types';

export class MLflowClient {
    private trackingUri: string;

    constructor(trackingUri: string) {
        this.trackingUri = trackingUri;
    }

    private async makeRequest<T>(endpoint: string, method: 'GET' | 'POST', body?: any): Promise<T> {
        const url = `${this.trackingUri}/api/2.0/mlflow/${endpoint}`;
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`MLflow API request failed: ${response.statusText} - ${errorBody}`);
        }

        return response.json() as Promise<T>;
    }

    async createExperiment(name: string): Promise<CreateExperimentResponse> {
        return this.makeRequest<CreateExperimentResponse>('experiments/create', 'POST', { name });
    }

    async getExperimentByName(name: string): Promise<Experiment | undefined> {
        const response = await this.makeRequest<{ experiments: Experiment[] }>('experiments/list', 'GET');
        return response.experiments.find(exp => exp.name === name);
    }

    async getExperimentIdByName(name: string): Promise<string | undefined> {
        const experiment = await this.getExperimentByName(name);
        return experiment?.experiment_id;
    }

    async createRun(runRequest: CreateRunRequest): Promise<CreateRunResponse> {
        return this.makeRequest<CreateRunResponse>('runs/create', 'POST', runRequest);
    }

    async logBatchParams(runId: string, params: Param[]): Promise<LogBatchResponse> {
        const requestBody: LogBatchRequest = { run_id: runId, params };
        return this.makeRequest<LogBatchResponse>('runs/log-batch', 'POST', requestBody);
    }

    async logBatchMetrics(runId: string, metrics: Metric[]): Promise<LogBatchResponse> {
        const requestBody: LogBatchRequest = { run_id: runId, metrics };
        return this.makeRequest<LogBatchResponse>('runs/log-batch', 'POST', requestBody);
    }

    async endRun(runId: string, endTime: string): Promise<void> {
        const requestBody: EndRunRequest = { run_id: runId, status: 'FINISHED', end_time: endTime };
        await this.makeRequest<void>('runs/update', 'POST', requestBody);
    }
}
