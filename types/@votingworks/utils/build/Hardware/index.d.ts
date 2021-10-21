import { Hardware } from '../types';
import KioskHardware from './KioskHardware';
import MemoryHardware from './MemoryHardware';
export * from './utils';
export { KioskHardware, MemoryHardware };
/**
 * Get Hardware based upon environment.
 */
export declare function getHardware(): Promise<Hardware>;
