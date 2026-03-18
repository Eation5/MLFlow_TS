# MLFlow_TS

![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue?style=flat-square&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-16%2B-green?style=flat-square&logo=node.js)
![MLflow](https://img.shields.io/badge/MLflow-2.x-orange?style=flat-square&logo=mlflow)
![License](https://img.shields.io/github/license/Eation5/MLFlow_TS?style=flat-square)

## Overview

MLFlow_TS is a TypeScript library and set of utilities for integrating MLflow with modern web applications and Node.js backends. It provides type-safe interfaces for interacting with the MLflow Tracking API, allowing developers to log parameters, metrics, artifacts, and models from TypeScript/JavaScript environments. This project aims to bridge the gap between MLOps practices and front-end/full-stack development, enabling seamless monitoring and management of machine learning experiments.

## Features

- **Type-Safe MLflow API Client**: Strongly typed client for MLflow Tracking API operations.
- **Experiment Management**: Log and retrieve experiment runs, parameters, and metrics.
- **Artifact & Model Logging**: Upload and download artifacts, and register models programmatically.
- **Web Application Integration**: Examples and utilities for integrating MLflow data into dashboards.
- **Node.js Backend Support**: Use MLFlow_TS in server-side applications for robust MLOps workflows.
- **Comprehensive Documentation**: Clear examples and API references for easy adoption.

## Installation

To get started with MLFlow_TS, clone the repository and install the dependencies using `pnpm`:

```bash
git clone https://github.com/Eation5/MLFlow_TS.git
cd MLFlow_TS
pnpm install
```

## Usage

Here's a quick example of how to use MLFlow_TS to log an experiment run:

```typescript
import { MLflowClient } from './src/client';
import { CreateRunRequest, Metric, Param } from './src/types';

const mlflowClient = new MLflowClient('http://localhost:5000'); // Your MLflow Tracking Server URI

async function logExperiment() {
  try {
    // 1. Create an experiment (if it doesn't exist)
    let experimentId = await mlflowClient.getExperimentIdByName('MyTypeScriptExperiment');
    if (!experimentId) {
      const newExperiment = await mlflowClient.createExperiment('MyTypeScriptExperiment');
      experimentId = newExperiment.experiment_id;
      console.log(`Created new experiment with ID: ${experimentId}`);
    }

    // 2. Create a new run
    const runRequest: CreateRunRequest = {
      experiment_id: experimentId,
      start_time: Date.now().toString(),
      tags: [
        { key: 'developer', value: 'Matthew Wilson' },
        { key: 'model_type', value: 'linear_regression' }
      ]
    };
    const run = await mlflowClient.createRun(runRequest);
    const runId = run.run.info.run_id;
    console.log(`Created new run with ID: ${runId}`);

    // 3. Log parameters
    const params: Param[] = [
      { key: 'learning_rate', value: '0.01' },
      { key: 'epochs', value: '100' }
    ];
    await mlflowClient.logBatchParams(runId, params);
    console.log('Logged parameters.');

    // 4. Log metrics
    const metrics: Metric[] = [
      { key: 'mse', value: 0.05, timestamp: Date.now(), step: 0 },
      { key: 'accuracy', value: 0.95, timestamp: Date.now(), step: 0 }
    ];
    await mlflowClient.logBatchMetrics(runId, metrics);
    console.log('Logged metrics.');

    // 5. End the run
    await mlflowClient.endRun(runId, Date.now().toString());
    console.log(`Run ${runId} ended.`);

  } catch (error) {
    console.error('Error logging experiment:', error);
  }
}

logExperiment();
```

## Project Structure

```
MLFlow_TS/
├── README.md
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── src/
│   ├── client.ts
│   ├── types.ts
│   └── index.ts
└── examples/
    └── log_experiment.ts
```

## Contributing

We welcome contributions! Please see `CONTRIBUTING.md` for details on how to get started.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.

## Contact

For any inquiries, please open an issue on GitHub or contact Matthew Wilson at [matthew.wilson.ai@example.com](mailto:matthew.wilson.ai@example.com).
