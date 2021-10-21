import { Printer, PrintOptions } from '../types';
export default class LocalPrinter implements Printer {
    print(options: PrintOptions): Promise<void>;
}
