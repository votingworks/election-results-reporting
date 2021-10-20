import * as z from 'zod';
import { ErrorsResponse, ISO8601Timestamp, OkResponse } from '.';
import { MarkAdjudications, SerializableBallotPageLayout } from '../hmpb';
import { BallotSheetInfo, Contest, ElectionDefinition, MarkThresholds, Precinct } from '../election';
export declare type Side = 'front' | 'back';
export declare const SideSchema: z.ZodUnion<[z.ZodLiteral<"front">, z.ZodLiteral<"back">]>;
export interface AdjudicationStatus {
    adjudicated: number;
    remaining: number;
}
export declare const AdjudicationStatusSchema: z.ZodSchema<AdjudicationStatus>;
export interface BatchInfo {
    id: string;
    label: string;
    startedAt: ISO8601Timestamp;
    endedAt?: ISO8601Timestamp;
    error?: string;
    count: number;
}
export declare const BatchInfoSchema: z.ZodSchema<BatchInfo>;
export declare enum ScannerStatus {
    WaitingForPaper = "WaitingForPaper",
    ReadyToScan = "ReadyToScan",
    Scanning = "Scanning",
    Accepting = "Accepting",
    Rejecting = "Rejecting",
    ReadyToAccept = "ReadyToAccept",
    Rejected = "Rejected",
    Calibrating = "Calibrating",
    Error = "Error",
    Unknown = "Unknown"
}
export declare const ScannerStatusSchema: z.ZodNativeEnum<typeof ScannerStatus>;
export interface ScanStatus {
    electionHash?: string;
    batches: BatchInfo[];
    adjudication: AdjudicationStatus;
    scanner: ScannerStatus;
}
export declare const ScanStatusSchema: z.ZodSchema<ScanStatus>;
/**
 * @url /scan/status
 * @method GET
 */
export declare type GetScanStatusResponse = ScanStatus;
/**
 * @url /scan/status
 * @method GET
 */
export declare const GetScanStatusResponseSchema: z.ZodSchema<GetScanStatusResponse>;
/**
 * @url /config/election
 * @method GET
 */
export declare type GetElectionConfigResponse = ElectionDefinition | null | string;
/**
 * @url /config/election
 * @method GET
 */
export declare const GetElectionConfigResponseSchema: z.ZodSchema<GetElectionConfigResponse>;
/**
 * @url /config/election
 * @method PATCH
 */
export declare type PatchElectionConfigResponse = OkResponse | ErrorsResponse;
/**
 * @url /config/election
 * @method PATCH
 */
export declare const PatchElectionConfigResponseSchema: z.ZodSchema<PatchElectionConfigResponse>;
/**
 * @url /config/election
 * @method PATCH
 */
export declare type PatchElectionConfigRequest = Uint8Array;
/**
 * @url /config/election
 * @method PATCH
 */
export declare const PatchElectionConfigRequestSchema: z.ZodSchema<PatchElectionConfigRequest>;
/**
 * @url /config/election
 * @method DELETE
 */
export declare type DeleteElectionConfigResponse = OkResponse;
/**
 * @url /config/election
 * @method DELETE
 */
export declare const DeleteElectionConfigResponseSchema: z.ZodSchema<DeleteElectionConfigResponse>;
/**
 * @url /config/testMode
 * @method GET
 */
export declare type GetTestModeConfigResponse = OkResponse<{
    testMode: boolean;
}>;
/**
 * @url /config/testMode
 * @method GET
 */
export declare const GetTestModeConfigResponseSchema: z.ZodSchema<GetTestModeConfigResponse>;
/**
 * @url /config/testMode
 * @method PATCH
 */
export interface PatchTestModeConfigRequest {
    testMode: boolean;
}
/**
 * @url /config/testMode
 * @method PATCH
 */
export declare const PatchTestModeConfigRequestSchema: z.ZodSchema<PatchTestModeConfigRequest>;
/**
 * @url /config/testMode
 * @method PATCH
 */
export declare type PatchTestModeConfigResponse = OkResponse | ErrorsResponse;
/**
 * @url /config/testMode
 * @method PATCH
 */
export declare const PatchTestModeConfigResponseSchema: z.ZodSchema<PatchTestModeConfigResponse>;
/**
 * @url /config/precinct
 * @method GET
 */
export declare type GetCurrentPrecinctConfigResponse = OkResponse<{
    precinctId?: Precinct['id'];
}>;
/**
 * @url /config/precinct
 * @method GET
 */
export declare const GetCurrentPrecinctResponseSchema: z.ZodSchema<GetCurrentPrecinctConfigResponse>;
/**
 * @url /config/precinct
 * @method PUT
 */
export interface PutCurrentPrecinctConfigRequest {
    precinctId?: Precinct['id'];
}
/**
 * @url /config/precinct
 * @method PUT
 */
export declare const PutCurrentPrecinctConfigRequestSchema: z.ZodSchema<PutCurrentPrecinctConfigRequest>;
/**
 * @url /config/precinct
 * @method PUT
 */
export declare type PutCurrentPrecinctConfigResponse = OkResponse | ErrorsResponse;
/**
 * @url /config/precinct
 * @method PUT
 */
export declare const PutCurrentPrecinctConfigResponseSchema: z.ZodSchema<PutCurrentPrecinctConfigResponse>;
/**
 * @url /config/precinct
 * @method DELETE
 */
export declare type DeleteCurrentPrecinctConfigResponse = OkResponse;
/**
 * @url /config/precinct
 * @method DELETE
 */
export declare const DeleteCurrentPrecinctConfigResponseSchema: z.ZodType<OkResponse<Record<string, unknown>>, z.ZodTypeDef, OkResponse<Record<string, unknown>>>;
/**
 * @url /config/markThresholdOverrides
 * @method GET
 */
export declare type GetMarkThresholdOverridesConfigResponse = OkResponse<{
    markThresholdOverrides?: MarkThresholds;
}>;
/**
 * @url /config/markThresholdOverrides
 * @method GET
 */
export declare const GetMarkThresholdOverridesConfigResponseSchema: z.ZodSchema<GetMarkThresholdOverridesConfigResponse>;
/**
 * @url /config/markThresholdOverrides
 * @method DELETE
 */
export declare type DeleteMarkThresholdOverridesConfigResponse = OkResponse;
/**
 * @url /config/markThresholdOverrides
 * @method DELETE
 */
export declare const DeleteMarkThresholdOverridesConfigResponseSchema: z.ZodType<OkResponse<Record<string, unknown>>, z.ZodTypeDef, OkResponse<Record<string, unknown>>>;
/**
 * @url /config/markThresholdOverrides
 * @method PATCH
 */
export interface PatchMarkThresholdOverridesConfigRequest {
    markThresholdOverrides?: MarkThresholds;
}
/**
 * @url /config/markThresholdOverrides
 * @method PATCH
 */
export declare const PatchMarkThresholdOverridesConfigRequestSchema: z.ZodSchema<PatchMarkThresholdOverridesConfigRequest>;
/**
 * @url /config/markThresholdOverrides
 * @method PATCH
 */
export declare type PatchMarkThresholdOverridesConfigResponse = OkResponse | ErrorsResponse;
/**
 * @url /config/markThresholdOverrides
 * @method PATCH
 */
export declare const PatchMarkThresholdOverridesConfigResponseSchema: z.ZodSchema<PatchMarkThresholdOverridesConfigResponse>;
/**
 * @url /config/skipElectionHashCheck
 * @method PATCH
 */
export interface PatchSkipElectionHashCheckConfigRequest {
    skipElectionHashCheck: boolean;
}
/**
 * @url /config/skipElectionHashCheck
 * @method PATCH
 */
export declare const PatchSkipElectionHashCheckConfigRequestSchema: z.ZodSchema<PatchSkipElectionHashCheckConfigRequest>;
/**
 * @url /config/skipElectionHashCheck
 * @method PATCH
 */
export declare type PatchSkipElectionHashCheckConfigResponse = OkResponse | ErrorsResponse;
/**
 * @url /config/skipElectionHashCheck
 * @method PATCH
 */
export declare const PatchSkipElectionHashCheckConfigResponseSchema: z.ZodSchema<PatchSkipElectionHashCheckConfigResponse>;
/**
 * @url /scan/scanBatch
 * @method POST
 */
export declare type ScanBatchRequest = never;
/**
 * @url /scan/scanBatch
 * @method POST
 */
export declare const ScanBatchRequestSchema: z.ZodSchema<ScanBatchRequest>;
/**
 * @url /scan/scanBatch
 * @method POST
 */
export declare type ScanBatchResponse = OkResponse<{
    batchId: string;
}> | ErrorsResponse;
/**
 * @url /scan/scanBatch
 * @method POST
 */
export declare const ScanBatchResponseSchema: z.ZodSchema<ScanBatchResponse>;
/**
 * @url /scan/scanContinue
 * @method POST
 */
export declare type ScanContinueRequest = {
    forceAccept: false;
} | {
    forceAccept: true;
    frontMarkAdjudications: MarkAdjudications;
    backMarkAdjudications: MarkAdjudications;
};
/**
 * @url /scan/scanContinue
 * @method POST
 */
export declare const ScanContinueRequestSchema: z.ZodSchema<ScanContinueRequest>;
/**
 * @url /scan/scanContinue
 * @method POST
 */
export declare type ScanContinueResponse = OkResponse | ErrorsResponse;
/**
 * @url /scan/scanContinue
 * @method POST
 */
export declare const ScanContinueResponseSchema: z.ZodSchema<ScanContinueResponse>;
/**
 * This is `never` because the request is not JSON, but multipart/form-data,
 * so none of the actual data ends up in `request.body`.
 *
 * @url /scan/hmpb/addTemplates
 * @method POST
 */
export declare type AddTemplatesRequest = never;
/**
 * This is `never` because the request is not JSON, but multipart/form-data,
 * so none of the actual data ends up in `request.body`.
 *
 * @url /scan/hmpb/addTemplates
 * @method POST
 */
export declare const AddTemplatesRequestSchema: z.ZodSchema<AddTemplatesRequest>;
/**
 * @url /scan/hmpb/addTemplates
 * @method POST
 */
export declare type AddTemplatesResponse = OkResponse | ErrorsResponse;
/**
 * @url /scan/hmpb/addTemplates
 * @method POST
 */
export declare const AddTemplatesResponseSchema: z.ZodSchema<AddTemplatesResponse>;
/**
 * This is `never` because there is no request data.
 *
 * @url /scan/hmpb/doneTemplates
 * @method POST
 */
export declare type DoneTemplatesRequest = never;
/**
 * This is `never` because there is no request data.
 *
 * @url /scan/hmpb/doneTemplates
 * @method POST
 */
export declare const DoneTemplatesRequestSchema: z.ZodSchema<DoneTemplatesRequest>;
/**
 * @url /scan/hmpb/doneTemplates
 * @method POST
 */
export declare type DoneTemplatesResponse = OkResponse;
/**
 * @url /scan/hmpb/doneTemplates
 * @method POST
 */
export declare const DoneTemplatesResponseSchema: z.ZodSchema<DoneTemplatesResponse>;
/**
 * This is `never` because there is no request data.
 *
 * @url /scan/export
 * @method POST
 */
export declare type ExportRequest = never;
/**
 * This is `never` because there is no request data.
 *
 * @url /scan/export
 * @method POST
 */
export declare const ExportRequestSchema: z.ZodSchema<ExportRequest>;
/**
 * @url /scan/export
 * @method POST
 */
export declare type ExportResponse = string;
/**
 * @url /scan/export
 * @method POST
 */
export declare const ExportResponseSchema: z.ZodSchema<ExportResponse>;
/**
 * This is `never` because there is no request data.
 *
 * @url /scan/zero
 * @method POST
 */
export declare type ZeroRequest = never;
/**
 * This is `never` because there is no request data.
 *
 * @url /scan/zero
 * @method POST
 */
export declare const ZeroRequestSchema: z.ZodSchema<ZeroRequest>;
/**
 * @url /scan/zero
 * @method POST
 */
export declare type ZeroResponse = OkResponse;
/**
 * @url /scan/zero
 * @method POST
 */
export declare const ZeroResponseSchema: z.ZodSchema<ZeroResponse>;
/**
 * This is `never` because there is no request data.
 *
 * @url /scan/calibrate
 * @method POST
 */
export declare type CalibrateRequest = never;
/**
 * This is `never` because there is no request data.
 *
 * @url /scan/calibrate
 * @method POST
 */
export declare const CalibrateRequestSchema: z.ZodSchema<CalibrateRequest>;
/**
 * @url /scan/calibrate
 * @method POST
 */
export declare type CalibrateResponse = OkResponse | ErrorsResponse;
/**
 * @url /scan/calibrate
 * @method POST
 */
export declare const CalibrateResponseSchema: z.ZodSchema<CalibrateResponse>;
/**
 * @url /scan/hmpb/review/next-sheet
 * @method GET
 */
export interface GetNextReviewSheetResponse {
    interpreted: BallotSheetInfo;
    layouts: {
        front?: SerializableBallotPageLayout;
        back?: SerializableBallotPageLayout;
    };
    definitions: {
        front?: {
            contestIds: readonly Contest['id'][];
        };
        back?: {
            contestIds: readonly Contest['id'][];
        };
    };
}
/**
 * @url /scan/hmpb/review/next-sheet
 * @method GET
 */
export declare const GetNextReviewSheetResponseSchema: z.ZodSchema<GetNextReviewSheetResponse>;
