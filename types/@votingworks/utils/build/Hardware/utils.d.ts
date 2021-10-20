/// <reference types="kiosk-browser" />
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
