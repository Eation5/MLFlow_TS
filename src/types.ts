export interface Experiment {
    experiment_id: string;
    name: string;
    artifact_location: string;
    lifecycle_stage: string;
    creation_time: number;
    last_update_time: number;
}

export interface CreateExperimentResponse {
    experiment_id: string;
}

export interface Param {
    key: string;
    value: string;
}

export interface Metric {
    key: string;
    value: number;
    timestamp: number;
    step: number;
}

export interface Tag {
    key: string;
    value: string;
}

export interface RunInfo {
    run_id: string;
    experiment_id: string;
    status: string;
    start_time: string;
    end_time: string;
    artifact_uri: string;
    lifecycle_stage: string;
}

export interface RunData {
    metrics: Metric[];
    params: Param[];
    tags: Tag[];
}

export interface Run {
    info: RunInfo;
    data: RunData;
}

export interface CreateRunRequest {
    experiment_id: string;
    start_time: string;
    tags?: Tag[];
}

export interface CreateRunResponse {
    run: Run;
}

export interface EndRunRequest {
    run_id: string;
    status: string;
    end_time: string;
}

export interface LogBatchRequest {
    run_id: string;
    metrics?: Metric[];
    params?: Param[];
    tags?: Tag[];
}

export interface LogBatchResponse {}

export interface SearchRunsResponse {
    runs: Run[];
}

export interface LogArtifactRequest {
    run_id: string;
    path: string;
    artifact_path?: string;
}
