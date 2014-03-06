﻿"use strict";

class DSP {
    invert(buffer: number[]) {
        var clone = new Array(buffer.length);
        for (var i = 0; i < buffer.length; i++) {
            clone[i] *= -1;
        }
        return clone;
    }

    //interleave

    //deinterleave

}
module FourierTransform {
    class TransformParameter {
        constructor(public bufferSize: number, public sampleRate: number) {
        }
        bandWidth = 2 / this.bufferSize * this.sampleRate / 2;
        spectrum = new Float32Array(this.bufferSize / 2);
        real = new Float32Array(this.bufferSize);
        imaginary = new Float32Array(this.bufferSize);
        peakBand = 0;
        peak = 0;

        getBandFrequency(index: number) {
            return this.bandWidth * index + this.bandWidth / 2;
        }

        calculateSpectrum() {
            var bufferSizeInversed = 2 / this.bufferSize;
            for (var i = 0; i < this.bufferSize / 2; i++) {
                var magnitude = bufferSizeInversed
                    * Math.sqrt(Math.pow(this.real[i], 2) + Math.pow(this.imaginary[i], 2));//absolute value of complex number

                if (magnitude > this.peak) {
                    this.peakBand = i;
                    this.peak = magnitude;
                }

                this.spectrum[i] = magnitude;
            }
        }
    }

    export class DFT {
        constructor(public bufferSize: number, public sampleRate: number) {
            var N = Math.pow(this.bufferSize, 2) / 2;
            this.sinTable = new Float32Array(N);
            this.cosTable = new Float32Array(N);
            for (var i = 0; i < N; i++) {
                this.sinTable[i] = Math.sin(i * Math.PI * 2 / bufferSize);
                this.cosTable[i] = Math.cos(i * Math.PI * 2 / bufferSize);
            }
        }
        private parameter = new TransformParameter(this.bufferSize, this.sampleRate);
        private sinTable: Float32Array;
        private cosTable: Float32Array;

        forward(buffer: number[]) {
            for (var i = 0; i < this.bufferSize / 2; i++) {
                var real = 0;
                var imaginary = 0;
                for (var i2 = 0; i2 < buffer.length; i++) {
                    real = this.cosTable[i * i2] * buffer[i2];
                    imaginary = this.sinTable[i * i2] * buffer[i2];
                }
                this.parameter.real[i] = real;
                this.parameter.imaginary[i] = imaginary;
            }
            return this.parameter.calculateSpectrum();
        }
    }

    export class FFT {
        constructor(public bufferSize: number, public sampleRate: number) {
            var limit = 1;
            var bit = this.bufferSize >> 1;

            while (limit < bufferSize) {
                for (var i = 0; i < limit; i++)
                    this.reverseTable[i + limit] = this.reverseTable[i] + bit;

                limit = limit << 1;
                bit = bit >> 1;
            }

            this.sinTable = new Float32Array(bufferSize);
            this.cosTable = new Float32Array(bufferSize);

            for (var i = 0; i < bufferSize; i++) {
                this.sinTable[i] = Math.sin(-Math.PI / i);
                this.cosTable[i] = Math.cos(-Math.PI / i);
            }
        }
        private parameter = new TransformParameter(this.bufferSize, this.sampleRate);
        private reverseTable = new Uint32Array(this.bufferSize);
        private sinTable: Float32Array;
        private cosTable: Float32Array;

        forward(buffer: number[]) {
            var bufferLengthLog2 = Math.log(this.bufferSize) / Math.LN2;
            if (bufferLengthLog2 % 1 != 0) {
                throw new Error("Invalid buffer size, must be a power of 2.");
            }
            if (this.bufferSize !== buffer.length) {
                throw new Error("Supplied buffer is not the same size as defined FFT. FFT Size: " + this.bufferSize + " Buffer Size: " + buffer.length);
            }

            for (var i = 0; i < this.bufferSize; i++) {
                this.parameter.real[i] = buffer[this.reverseTable[i]];
                this.parameter.imaginary[i] = 0;
            }

            var halfSize = 1;
            while (halfSize < this.bufferSize) {

            }
            //not completely implemented
        }
    }
}