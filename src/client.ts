import fetch from 'node-fetch';
import { CreateExperimentResponse, CreateRunRequest, CreateRunResponse, EndRunRequest, Experiment, GetExperimentResponse, LogBatchRequest, LogBatchResponse, Param, Metric, Run, SearchRunsResponse, LogArtifactRequest } from './types';

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

    async getRun(runId: string): Promise<Run> {
        const response = await this.makeRequest<{ run: Run }>('runs/get', 'GET', { run_id: runId });
        return response.run;
    }

    async searchRuns(experimentIds: string[], filter?: string, orderBy?: string[], maxResults?: number): Promise<SearchRunsResponse> {
        const requestBody = { experiment_ids: experimentIds, filter, order_by: orderBy, max_results: maxResults };
        return this.makeRequest<SearchRunsResponse>('runs/search', 'POST', requestBody);
    }

    async logBatchParams(runId: string, params: Param[]): Promise<LogBatchResponse> {
        const requestBody: LogBatchRequest = { run_id: runId, params };
        return this.makeRequest<LogBatchResponse>('runs/log-batch', 'POST', requestBody);
    }

    async logBatchMetrics(runId: string, metrics: Metric[]): Promise<LogBatchResponse> {
        const requestBody: LogBatchRequest = { run_id: runId, metrics };
        return this.makeRequest<LogBatchResponse>('runs/log-batch', 'POST', requestBody);
    }

    async logArtifact(runId: string, path: string, artifactPath?: string): Promise<void> {
        const requestBody: LogArtifactRequest = { run_id: runId, path, artifact_path: artifactPath };
        await this.makeRequest<void>('runs/log-artifact', 'POST', requestBody);
    }

    async endRun(runId: string, status: 'FINISHED' | 'FAILED' | 'KILLED', endTime: string): Promise<void> {
        const requestBody: EndRunRequest = { run_id: runId, status, end_time: endTime };
        await this.makeRequest<void>('runs/update', 'POST', requestBody);
    }
}
