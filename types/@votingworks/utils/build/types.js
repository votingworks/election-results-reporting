"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typedAs = exports.PrecinctScannerCardTallySchema = exports.TallySourceMachineTypeSchema = exports.TallySourceMachineType = void 0;
const types_1 = require("@votingworks/types");
const zod_1 = require("zod");
// Currently we only support precinct scanner tallies but this enum exists for future ability to specify different types
var TallySourceMachineType;
(function (TallySourceMachineType) {
    TallySourceMachineType["PRECINCT_SCANNER"] = "precinct_scanner";
})(TallySourceMachineType = exports.TallySourceMachineType || (exports.TallySourceMachineType = {}));
exports.TallySourceMachineTypeSchema = zod_1.z.nativeEnum(TallySourceMachineType);
exports.PrecinctScannerCardTallySchema = zod_1.z.object({
    tallyMachineType: zod_1.z.literal(TallySourceMachineType.PRECINCT_SCANNER),
    tally: types_1.CompressedTallySchema,
    machineId: types_1.MachineId,
    timeSaved: zod_1.z.number(),
    totalBallotsScanned: zod_1.z.number(),
    isLiveMode: zod_1.z.boolean(),
    isPollsOpen: zod_1.z.boolean(),
    absenteeBallots: zod_1.z.number(),
    precinctBallots: zod_1.z.number(),
    precinctSelection: types_1.PrecinctSelectionSchema,
});
/**
 * Identity function useful for asserting the type of the argument/return value.
 * Mainly useful with an object literal argument used in a context where a
 * variable declaration with an explicit type annotation is inelegant, such as
 * when providing a response to `fetch-mock`.
 *
 * @example
 *
 * fetchMock.get('/api', typedAs<MyResponseType>({
 *   status: 'ok',
 *   value: 42,
 * }))
 *
 * @example
 *
 * expect(value).toEqual(typedAs<MyType>({
 *   a: 1,
 *   b: 2,
 * }))
 */
function typedAs(value) {
    return value;
}
exports.typedAs = typedAs;
