/**
 * Experiments Service
 * 
 * Handles API communication with the backend experiments endpoints
 * for creating and updating experiment logs during the scientific method workflow.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface CreatePredictionRequest {
    userId: string;
    questId: string;
    prediction: string;
}

export interface CreatePredictionResponse {
    logId: string;
}

export interface UpdateResultRequest {
    logId: string;
    observation: string;
    resultData?: Record<string, unknown>;
    reflection?: string;
}

export interface UpdateResultResponse {
    success: boolean;
    log?: {
        _id: string;
        user_id: string;
        quest_id: string;
        prediction_text: string;
        observation_text?: string;
        result_data?: Record<string, unknown>;
        reflection_text?: string;
        timestamp: string;
    };
}

/**
 * Create a new experiment log with the student's prediction.
 * This starts the experiment workflow.
 */
export async function createPrediction(
    data: CreatePredictionRequest
): Promise<CreatePredictionResponse> {
    const response = await fetch(`${API_BASE_URL}/experiments/predict`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to create prediction: ${error}`);
    }

    return response.json();
}

/**
 * Update an existing experiment log with observation and result data.
 * This completes the experiment workflow.
 */
export async function updateResult(
    data: UpdateResultRequest
): Promise<UpdateResultResponse> {
    const response = await fetch(`${API_BASE_URL}/experiments/result`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            logId: data.logId,
            observation: data.observation,
            resultData: data.resultData,
            reflection: data.reflection || '',
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to update result: ${error}`);
    }

    return { success: true };
}

/**
 * Experiment phases for the Scientific Method workflow
 */
export type ExperimentPhase = 'prediction' | 'experiment' | 'observation' | 'complete';

/**
 * Experiment state management helper
 */
export interface ExperimentState {
    phase: ExperimentPhase;
    logId: string | null;
    prediction: string | null;
    observation: string | null;
    isLoading: boolean;
    error: string | null;
}

export const initialExperimentState: ExperimentState = {
    phase: 'prediction',
    logId: null,
    prediction: null,
    observation: null,
    isLoading: false,
    error: null,
};
