/// <reference types="kiosk-browser" />
import { PrinterStatus } from '../types';
import MemoryHardware from './MemoryHardware';
/**
 * Implements the `Hardware` API by accessing it through the kiosk.
 */
export default class KioskHardware extends MemoryHardware {
    private kiosk;
    constructor(kiosk: KioskBrowser.Kiosk);
    /**
     * Reads Battery status
     */
    readBatteryStatus(): Promise<KioskBrowser.BatteryInfo>;
    /**
     * Determines whether there is a configured & connected printer.
     */
    readPrinterStatus(): Promise<PrinterStatus>;
    /**
     * Gets an observable that yields the current set of connected USB devices as
     * devices are added and removed.
     *
     * Given a set of initial devices (e.g. {mouse, keyboard}), a subscriber would
     * receive the initial set. Once a new device is added (e.g. flash drive), that
     * first subscriber receives a new set (e.g. {mouse, keyboard, flash drive}).
     * New subscribers immediately receive the same current set.
     */
    devices: import("rxjs").Observable<Iterable<KioskBrowser.Device>>;
    /**
     * Gets an observable that yields the current set of printers as printers are
     * configured or devices are added or removed.
     */
    printers: import("rxjs").Observable<Iterable<KioskBrowser.PrinterInfo>>;
}
