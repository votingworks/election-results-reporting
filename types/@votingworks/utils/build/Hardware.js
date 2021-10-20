"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHardware = exports.KioskHardware = exports.MemoryHardware = exports.isPrinter = exports.isCardReader = exports.OmniKeyCardReaderProductId = exports.OmniKeyCardReaderVendorId = exports.OmniKeyCardReaderManufacturer = exports.OmniKeyCardReaderDeviceName = exports.isAccessibleController = exports.BrotherHLL5100DNProductId = exports.BrotherHLL5100DNVendorId = exports.AccessibleControllerProductId = exports.AccessibleControllerVendorId = void 0;
const rxjs_1 = require("rxjs");
exports.AccessibleControllerVendorId = 0x0d8c;
exports.AccessibleControllerProductId = 0x0170;
exports.BrotherHLL5100DNVendorId = 0x04f9;
exports.BrotherHLL5100DNProductId = 0x007f;
/**
 * Determines whether a device is the accessible controller.
 */
function isAccessibleController(device) {
    return (device.vendorId === exports.AccessibleControllerVendorId &&
        device.productId === exports.AccessibleControllerProductId);
}
exports.isAccessibleController = isAccessibleController;
exports.OmniKeyCardReaderDeviceName = 'OMNIKEY 3x21 Smart Card Reader';
exports.OmniKeyCardReaderManufacturer = 'HID Global';
exports.OmniKeyCardReaderVendorId = 0x076b;
exports.OmniKeyCardReaderProductId = 0x3031;
/**
 * Determines whether a device is the card reader.
 */
function isCardReader(device) {
    return ((device.manufacturer.replace(/_/g, ' ') === exports.OmniKeyCardReaderManufacturer &&
        device.deviceName.replace(/_/g, ' ') === exports.OmniKeyCardReaderDeviceName) ||
        (device.vendorId === exports.OmniKeyCardReaderVendorId &&
            device.productId === exports.OmniKeyCardReaderProductId));
}
exports.isCardReader = isCardReader;
/**
 * Determines whether a device is a supported printer.
 */
function isPrinter(device) {
    return (device.vendorId === exports.BrotherHLL5100DNVendorId &&
        device.productId === exports.BrotherHLL5100DNProductId);
}
exports.isPrinter = isPrinter;
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
            productId: exports.AccessibleControllerProductId,
            vendorId: exports.AccessibleControllerVendorId,
            serialNumber: '',
        };
        this.printer = {
            deviceAddress: 0,
            deviceName: 'HL-L5100DN_series',
            locationId: 0,
            manufacturer: 'Brother',
            productId: exports.BrotherHLL5100DNProductId,
            vendorId: exports.BrotherHLL5100DNVendorId,
            serialNumber: '',
        };
        this.cardReader = {
            deviceAddress: 0,
            deviceName: exports.OmniKeyCardReaderDeviceName,
            locationId: 0,
            manufacturer: exports.OmniKeyCardReaderManufacturer,
            vendorId: exports.OmniKeyCardReaderVendorId,
            productId: exports.OmniKeyCardReaderProductId,
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
            connected: Array.from(this.connectedDevices).some(isPrinter),
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
exports.MemoryHardware = MemoryHardware;
/**
 * Implements the `Hardware` API by accessing it through the kiosk.
 */
class KioskHardware extends MemoryHardware {
    constructor(kiosk) {
        super();
        this.kiosk = kiosk;
        /**
         * Gets an observable that yields the current set of connected USB devices as
         * devices are added and removed.
         *
         * Given a set of initial devices (e.g. {mouse, keyboard}), a subscriber would
         * receive the initial set. Once a new device is added (e.g. flash drive), that
         * first subscriber receives a new set (e.g. {mouse, keyboard, flash drive}).
         * New subscribers immediately receive the same current set.
         */
        this.devices = this.kiosk.devices;
        /**
         * Gets an observable that yields the current set of printers as printers are
         * configured or devices are added or removed.
         */
        this.printers = this.kiosk.printers;
    }
    /**
     * Reads Battery status
     */
    async readBatteryStatus() {
        return this.kiosk.getBatteryInfo();
    }
    /**
     * Determines whether there is a configured & connected printer.
     */
    async readPrinterStatus() {
        const printers = await this.kiosk.getPrinterInfo();
        return { connected: printers.some((printer) => printer.connected) };
    }
}
exports.KioskHardware = KioskHardware;
/**
 * Get Hardware based upon environment.
 */
async function getHardware() {
    return window.kiosk
        ? // Running in kiosk-browser, so use that to access real hardware.
            new KioskHardware(window.kiosk)
        : // Running in normal browser, so emulate hardware.
            await MemoryHardware.buildDemo();
}
exports.getHardware = getHardware;
