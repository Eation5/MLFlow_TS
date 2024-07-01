import { MLflowClient } from './client';
import { CreateRunRequest, Param, Metric } from './types';

export * from './client';
export * from './types';

// Example usage of the MLflowClient
async function main() {
    const trackingUri = process.env.MLFLOW_TRACKING_URI || 'http://localhost:5000';
    const client = new MLflowClient(trackingUri);

    const experimentName = 'TypeScript_ML_Experiment';
    let experimentId: string | undefined;

    try {
        // Try to get existing experiment
        const existingExperiment = await client.getExperimentByName(experimentName);
        if (existingExperiment) {
            experimentId = existingExperiment.experiment_id;
            console.log(`Using existing experiment: ${experimentName} (ID: ${experimentId})`);
        } else {
            // Create a new experiment if it doesn't exist
            const createResponse = await client.createExperiment(experimentName);
            experimentId = createResponse.experiment_id;
            console.log(`Created new experiment: ${experimentName} (ID: ${experimentId})`);
        }

        if (!experimentId) {
            throw new Error("Failed to get or create experiment ID.");
        }

        // Create a new run
        const runRequest: CreateRunRequest = {
            experiment_id: experimentId,
            start_time: new Date().toISOString(),
            tags: [{ key: 'model_type', value: 'linear_regression' }]
        };
        const runResponse = await client.createRun(runRequest);
        const runId = runResponse.run.info.run_id;
        console.log(`Created new run with ID: ${runId}`);

        // Log parameters
        const params: Param[] = [
            { key: 'learning_rate', value: '0.01' },
            { key: 'epochs', value: '100' }
        ];
        await client.logBatchParams(runId, params);
        console.log('Logged parameters.');

        // Log metrics
        const metrics: Metric[] = [
            { key: 'accuracy', value: 0.92, timestamp: Date.now(), step: 0 },
            { key: 'loss', value: 0.08, timestamp: Date.now(), step: 0 }
        ];
        await client.logBatchMetrics(runId, metrics);
        console.log('Logged metrics.');

        // End the run
        await client.endRun(runId, 'FINISHED', new Date().toISOString());
        console.log(`Run ${runId} finished.`);

    } catch (error) {
        console.error('Error in MLflow example:', error);
    }
}

// Call the main function if this script is executed directly
// if (require.main === module) {
//     main();
// }
