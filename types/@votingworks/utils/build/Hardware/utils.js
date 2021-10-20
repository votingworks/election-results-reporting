"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPrinter = exports.isCardReader = exports.OmniKeyCardReaderProductId = exports.OmniKeyCardReaderVendorId = exports.OmniKeyCardReaderManufacturer = exports.OmniKeyCardReaderDeviceName = exports.isAccessibleController = exports.BrotherHLL5100DNProductId = exports.BrotherHLL5100DNVendorId = exports.AccessibleControllerProductId = exports.AccessibleControllerVendorId = void 0;
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
