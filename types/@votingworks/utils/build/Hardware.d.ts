/// <reference types="kiosk-browser" />
import { Observable } from 'rxjs';
interface PrinterStatus {
    connected: boolean;
}
export declare const AccessibleControllerVendorId = 3468;
export declare const AccessibleControllerProductId = 368;
export declare const BrotherHLL5100DNVendorId = 1273;
export declare const BrotherHLL5100DNProductId = 127;
/**
 * Determines whether a device is the accessible controller.
 */
export declare function isAccessibleController(device: KioskBrowser.Device): boolean;
export declare const OmniKeyCardReaderDeviceName = "OMNIKEY 3x21 Smart Card Reader";
export declare const OmniKeyCardReaderManufacturer = "HID Global";
export declare const OmniKeyCardReaderVendorId = 1899;
export declare const OmniKeyCardReaderProductId = 12337;
/**
 * Determines whether a device is the card reader.
 */
export declare function isCardReader(device: KioskBrowser.Device): boolean;
/**
 * Determines whether a device is a supported printer.
 */
export declare function isPrinter(device: KioskBrowser.Device): boolean;
/**
 * Defines the API for accessing hardware status.
 */
export interface Hardware {
    /**
     * Reads Battery status
     */
    readBatteryStatus(): Promise<KioskBrowser.BatteryInfo>;
    /**
     * Reads Printer status
     */
    readPrinterStatus(): Promise<PrinterStatus>;
    /**
     * Subscribe to USB device updates.
     */
    devices: Observable<Iterable<KioskBrowser.Device>>;
    /**
     * Subscribe to USB device updates.
     */
    printers: Observable<Iterable<KioskBrowser.PrinterInfo>>;
}
/**
 * Implements the `Hardware` API with an in-memory implementation.
 */
export declare class MemoryHardware implements Hardware {
    private batteryStatus;
    private connectedDevices;
    private accessibleController;
    private printer;
    private cardReader;
    static build({ connectPrinter, connectAccessibleController, connectCardReader, }?: {
        connectPrinter?: boolean;
        connectAccessibleController?: boolean;
        connectCardReader?: boolean;
    }): Promise<MemoryHardware>;
    static buildStandard(): Promise<MemoryHardware>;
    static buildDemo(): Promise<MemoryHardware>;
    /**
     * Sets Accessible Controller connected
     */
    setAccessibleControllerConnected(connected: boolean): Promise<void>;
    /**
     * Reads Battery status
     */
    readBatteryStatus(): Promise<KioskBrowser.BatteryInfo>;
    /**
     * Sets Battery discharging
     */
    setBatteryDischarging(discharging: boolean): Promise<void>;
    /**
     * Sets Battery level. Number between 0–1.
     */
    setBatteryLevel(level: number): Promise<void>;
    /**
     * Sets Card Reader connected
     */
    setCardReaderConnected(connected: boolean): Promise<void>;
    /**
     * Reads Printer status
     */
    readPrinterStatus(): Promise<PrinterStatus>;
    /**
     * Sets Printer connected
     */
    setPrinterConnected(connected: boolean): Promise<void>;
    private devicesSubject;
    /**
     * Subscribe to USB device updates.
     */
    devices: Observable<Iterable<KioskBrowser.Device>>;
    private printersSubject;
    /**
     * Subscribe to printer updates.
     */
    printers: Observable<Iterable<KioskBrowser.PrinterInfo>>;
    /**
     * Determines whether a device is in the list of connected devices.
     */
    hasDevice(device: KioskBrowser.Device): boolean;
    /**
     * Sets the connection status for a device by adding or removing it as needed.
     */
    setDeviceConnected(device: KioskBrowser.Device, connected: boolean): void;
    /**
     * Adds a device to the set of connected devices.
     */
    addDevice(device: KioskBrowser.Device): void;
    /**
     * Removes a previously-added device from the set of connected devices.
     */
    removeDevice(device: KioskBrowser.Device): void;
}
/**
 * Implements the `Hardware` API by accessing it through the kiosk.
 */
export declare class KioskHardware extends MemoryHardware {
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
    devices: Observable<Iterable<KioskBrowser.Device>>;
    /**
     * Gets an observable that yields the current set of printers as printers are
     * configured or devices are added or removed.
     */
    printers: Observable<Iterable<KioskBrowser.PrinterInfo>>;
}
/**
 * Get Hardware based upon environment.
 */
export declare function getHardware(): Promise<Hardware>;
export {};
