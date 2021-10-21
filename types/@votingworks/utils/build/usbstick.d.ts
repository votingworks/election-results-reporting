export declare const FLUSH_IO_DELAY_MS = 10000;
export declare enum UsbDriveStatus {
    notavailable = "notavailable",
    absent = "absent",
    present = "present",
    mounted = "mounted",
    recentlyEjected = "recentlyEjected",
    ejecting = "ejecting"
}
export declare const getDevicePath: () => Promise<string | undefined>;
export declare const getStatus: () => Promise<UsbDriveStatus>;
export declare const doMount: () => Promise<void>;
export declare const doUnmount: () => Promise<void>;
