"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const utils_1 = require("./utils");
/**
 * Implements the `Hardware` API with an in-memory implementation.
 */
class MemoryHardware {
    constructor() {
        this.batteryStatus = {
            discharging: false,
            level: 0.8,
        };
        this.connectedDevices = new Set();
        this.accessibleController = {
            deviceAddress: 0,
            deviceName: 'USB Advanced Audio Device',
            locationId: 0,
            manufacturer: 'C-Media Electronics Inc.',
            productId: utils_1.AccessibleControllerProductId,
            vendorId: utils_1.AccessibleControllerVendorId,
            serialNumber: '',
        };
        this.printer = {
            deviceAddress: 0,
            deviceName: 'HL-L5100DN_series',
            locationId: 0,
            manufacturer: 'Brother',
            productId: utils_1.BrotherHLL5100DNProductId,
            vendorId: utils_1.BrotherHLL5100DNVendorId,
            serialNumber: '',
        };
        this.cardReader = {
            deviceAddress: 0,
            deviceName: utils_1.OmniKeyCardReaderDeviceName,
            locationId: 0,
            manufacturer: utils_1.OmniKeyCardReaderManufacturer,
            vendorId: utils_1.OmniKeyCardReaderVendorId,
            productId: utils_1.OmniKeyCardReaderProductId,
            serialNumber: '',
        };
        this.devicesSubject = new rxjs_1.BehaviorSubject(this.connectedDevices);
        /**
         * Subscribe to USB device updates.
         */
        this.devices = this.devicesSubject;
        this.printersSubject = new rxjs_1.BehaviorSubject([]);
        /**
         * Subscribe to printer updates.
         */
        this.printers = this.printersSubject;
    }
    static async build({ connectPrinter = false, connectAccessibleController = false, connectCardReader = false, } = {}) {
        const newMemoryHardware = new MemoryHardware();
        await newMemoryHardware.setPrinterConnected(connectPrinter);
        await newMemoryHardware.setAccessibleControllerConnected(connectAccessibleController);
        await newMemoryHardware.setCardReaderConnected(connectCardReader);
        return newMemoryHardware;
    }
    static async buildStandard() {
        return await MemoryHardware.build({
            connectPrinter: true,
            connectAccessibleController: true,
            connectCardReader: true,
        });
    }
    static async buildDemo() {
        return await MemoryHardware.build({
            connectPrinter: true,
            connectAccessibleController: false,
            connectCardReader: true,
        });
    }
    /**
     * Sets Accessible Controller connected
     */
    async setAccessibleControllerConnected(connected) {
        this.setDeviceConnected(this.accessibleController, connected);
    }
    /**
     * Reads Battery status
     */
    async readBatteryStatus() {
        return this.batteryStatus;
    }
    /**
     * Sets Battery discharging
     */
    async setBatteryDischarging(discharging) {
        this.batteryStatus = {
            ...this.batteryStatus,
            discharging,
        };
    }
    /**
     * Sets Battery level. Number between 0–1.
     */
    async setBatteryLevel(level) {
        this.batteryStatus = {
            ...this.batteryStatus,
            level,
        };
    }
    /**
     * Sets Card Reader connected
     */
    async setCardReaderConnected(connected) {
        this.setDeviceConnected(this.cardReader, connected);
    }
    /**
     * Reads Printer status
     */
    async readPrinterStatus() {
        return {
            connected: Array.from(this.connectedDevices).some(utils_1.isPrinter),
        };
    }
    /**
     * Sets Printer connected
     */
    async setPrinterConnected(connected) {
        this.setDeviceConnected(this.printer, connected);
        this.printersSubject.next([
            {
                name: this.printer.deviceName,
                description: this.printer.manufacturer,
                connected,
                isDefault: true,
                status: 0,
            },
        ]);
    }
    /**
     * Determines whether a device is in the list of connected devices.
     */
    hasDevice(device) {
        return this.connectedDevices.has(device);
    }
    /**
     * Sets the connection status for a device by adding or removing it as needed.
     */
    setDeviceConnected(device, connected) {
        if (connected !== this.hasDevice(device)) {
            if (connected) {
                this.addDevice(device);
            }
            else {
                this.removeDevice(device);
            }
        }
    }
    /**
     * Adds a device to the set of connected devices.
     */
    addDevice(device) {
        if (this.connectedDevices.has(device)) {
            throw new Error(`cannot add device that was already added: ${device.deviceName}`);
        }
        this.connectedDevices.add(device);
        this.devicesSubject.next(this.connectedDevices);
    }
    /**
     * Removes a previously-added device from the set of connected devices.
     */
    removeDevice(device) {
        const hadDevice = this.connectedDevices.delete(device);
        if (!hadDevice) {
            throw new Error(`cannot remove device that was never added: ${device.deviceName}`);
        }
        this.devicesSubject.next(this.connectedDevices);
    }
}
exports.default = MemoryHardware;
