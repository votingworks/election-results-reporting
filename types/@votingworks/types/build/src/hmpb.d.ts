import { z } from 'zod';
import { AdjudicationReason, Candidate, Contest, ContestOption, HMPBBallotPageMetadata, TargetShape } from './election';
import { Corners, Rect, Size } from './geometry';
import { ImageData } from './image';
export declare type BallotPageMetadata = HMPBBallotPageMetadata;
export declare const BallotPageMetadataSchema: z.ZodType<HMPBBallotPageMetadata, z.ZodTypeDef, HMPBBallotPageMetadata>;
export interface BallotImage {
    imageData: ImageData;
    metadata: BallotPageMetadata;
}
export declare const BallotImageSchema: z.ZodSchema<BallotImage>;
export interface BallotPageContestOptionLayout {
    bounds: Rect;
    target: TargetShape;
}
export declare const BallotPageContestOptionLayoutSchema: z.ZodSchema<BallotPageContestOptionLayout>;
export interface BallotPageContestLayout {
    bounds: Rect;
    corners: Corners;
    options: readonly BallotPageContestOptionLayout[];
}
export declare const BallotPageContestLayoutSchema: z.ZodSchema<BallotPageContestLayout>;
export interface BallotPageLayout {
    ballotImage: BallotImage;
    contests: readonly BallotPageContestLayout[];
}
export declare const BallotPageLayoutSchema: z.ZodSchema<BallotPageLayout>;
export declare type SerializableBallotPageLayout = Omit<BallotPageLayout, 'ballotImage'> & {
    ballotImage: Omit<BallotPageLayout['ballotImage'], 'imageData'> & {
        imageData: Size;
    };
};
export declare const SerializableBallotPageLayoutSchema: z.ZodSchema<SerializableBallotPageLayout>;
export declare enum MarkStatus {
    Marked = "marked",
    Unmarked = "unmarked",
    Marginal = "marginal",
    UnmarkedWriteIn = "unmarkedWriteIn"
}
export declare const MarkStatusSchema: z.ZodSchema<MarkStatus>;
export interface MarksByOptionId {
    [key: string]: MarkStatus | undefined;
}
export declare const MarksByOptionIdSchema: z.ZodSchema<MarksByOptionId>;
export interface MarksByContestId {
    [key: string]: MarksByOptionId | undefined;
}
export declare const MarksByContestIdSchema: z.ZodSchema<MarksByContestId>;
export interface UninterpretableBallotMarkAdjudication {
    readonly type: AdjudicationReason.UninterpretableBallot;
    readonly contestId: Contest['id'];
    readonly optionId: ContestOption['id'];
    readonly isMarked: boolean;
}
export declare const UninterpretableBallotMarkAdjudicationSchema: z.ZodSchema<UninterpretableBallotMarkAdjudication>;
export interface OvervoteMarkAdjudication {
    readonly type: AdjudicationReason.Overvote;
    readonly contestId: Contest['id'];
    readonly optionId: ContestOption['id'];
    readonly isMarked: boolean;
}
export declare const OvervoteMarkAdjudicationSchema: z.ZodSchema<OvervoteMarkAdjudication>;
export interface UndervoteMarkAdjudication {
    readonly type: AdjudicationReason.Undervote;
    readonly contestId: Contest['id'];
    readonly optionId: ContestOption['id'];
    readonly isMarked: boolean;
}
export declare const UndervoteMarkAdjudicationSchema: z.ZodSchema<UndervoteMarkAdjudication>;
export interface MarginalMarkAdjudication {
    readonly type: AdjudicationReason.MarginalMark;
    readonly contestId: Contest['id'];
    readonly optionId: ContestOption['id'];
    readonly isMarked: boolean;
}
export declare const MarginalMarkAdjudicationSchema: z.ZodSchema<MarginalMarkAdjudication>;
export interface WriteInMarkAdjudicationMarked {
    readonly type: AdjudicationReason.WriteIn | AdjudicationReason.UnmarkedWriteIn;
    readonly isMarked: true;
    readonly contestId: Contest['id'];
    readonly optionId: ContestOption['id'];
    readonly name: Candidate['name'];
}
export declare const WriteInMarkAdjudicationMarkedSchema: z.ZodSchema<WriteInMarkAdjudicationMarked>;
export interface WriteInMarkAdjudicationUnmarked {
    readonly type: AdjudicationReason.WriteIn | AdjudicationReason.UnmarkedWriteIn;
    readonly isMarked: false;
    readonly contestId: Contest['id'];
    readonly optionId: ContestOption['id'];
}
export declare const WriteInMarkAdjudicationUnmarkedSchema: z.ZodSchema<WriteInMarkAdjudicationUnmarked>;
export declare type WriteInMarkAdjudication = WriteInMarkAdjudicationMarked | WriteInMarkAdjudicationUnmarked;
export declare const WriteInMarkAdjudicationSchema: z.ZodSchema<WriteInMarkAdjudication>;
export declare type MarkAdjudication = UninterpretableBallotMarkAdjudication | OvervoteMarkAdjudication | UndervoteMarkAdjudication | MarginalMarkAdjudication | WriteInMarkAdjudication;
export declare const MarkAdjudicationSchema: z.ZodSchema<MarkAdjudication>;
export declare type MarkAdjudications = readonly MarkAdjudication[];
export declare const MarkAdjudicationsSchema: z.ZodSchema<MarkAdjudications>;
