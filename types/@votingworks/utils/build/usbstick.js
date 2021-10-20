"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doUnmount = exports.doMount = exports.getStatus = exports.getDevicePath = exports.UsbDriveStatus = exports.FLUSH_IO_DELAY_MS = void 0;
const assert_1 = require("assert");
const sleep_1 = require("./sleep");
exports.FLUSH_IO_DELAY_MS = 10000;
const isAvailable = () => {
    return !!window.kiosk;
};
var UsbDriveStatus;
(function (UsbDriveStatus) {
    UsbDriveStatus["notavailable"] = "notavailable";
    UsbDriveStatus["absent"] = "absent";
    UsbDriveStatus["present"] = "present";
    UsbDriveStatus["mounted"] = "mounted";
    UsbDriveStatus["recentlyEjected"] = "recentlyEjected";
    UsbDriveStatus["ejecting"] = "ejecting";
})(UsbDriveStatus = exports.UsbDriveStatus || (exports.UsbDriveStatus = {}));
const getDevice = async () => {
    var _a, _b;
    return (_b = (await ((_a = window.kiosk) === null || _a === void 0 ? void 0 : _a.getUsbDrives()))) === null || _b === void 0 ? void 0 : _b[0];
};
const getDevicePath = async () => {
    const device = await getDevice();
    return device === null || device === void 0 ? void 0 : device.mountPoint;
};
exports.getDevicePath = getDevicePath;
const getStatus = async () => {
    if (!isAvailable()) {
        return UsbDriveStatus.notavailable;
    }
    const device = await getDevice();
    if (!device) {
        return UsbDriveStatus.absent;
    }
    if (device.mountPoint) {
        return UsbDriveStatus.mounted;
    }
    return UsbDriveStatus.present;
};
exports.getStatus = getStatus;
const doMount = async () => {
    const device = await getDevice();
    if (!device || device.mountPoint) {
        return;
    }
    assert_1.strict(window.kiosk);
    await window.kiosk.mountUsbDrive(device.deviceName);
};
exports.doMount = doMount;
const doUnmount = async () => {
    const device = await getDevice();
    if (!(device === null || device === void 0 ? void 0 : device.mountPoint)) {
        return;
    }
    assert_1.strict(window.kiosk);
    await window.kiosk.unmountUsbDrive(device.deviceName);
    return await sleep_1.sleep(exports.FLUSH_IO_DELAY_MS);
};
exports.doUnmount = doUnmount;
