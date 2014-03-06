declare class DSP {
    public invert(buffer: number[]): any[];
}
declare module FourierTransform {
    class DFT {
        public bufferSize: number;
        public sampleRate: number;
        constructor(bufferSize: number, sampleRate: number);
        private parameter;
        private sinTable;
        private cosTable;
        public forward(buffer: number[]): void;
    }
    class FFT {
        public bufferSize: number;
        public sampleRate: number;
        constructor(bufferSize: number, sampleRate: number);
        private parameter;
        private reverseTable;
        private sinTable;
        private cosTable;
        public forward(buffer: number[]): void;
    }
}
