/// <reference types="kiosk-browser" />
import { Observable } from 'rxjs';
import { Hardware, PrinterStatus } from '../types';
/**
 * Implements the `Hardware` API with an in-memory implementation.
 */
export default class MemoryHardware implements Hardware {
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
