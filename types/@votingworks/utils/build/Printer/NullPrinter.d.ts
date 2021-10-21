import { Printer } from '../types';
export default class NullPrinter implements Printer {
    print(): Promise<void>;
}
