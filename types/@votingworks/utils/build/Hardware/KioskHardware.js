"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MemoryHardware_1 = __importDefault(require("./MemoryHardware"));
/**
 * Implements the `Hardware` API by accessing it through the kiosk.
 */
class KioskHardware extends MemoryHardware_1.default {
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
exports.default = KioskHardware;
