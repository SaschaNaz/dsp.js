"use strict";
var DSP = (function () {
    function DSP() {
    }
    DSP.prototype.invert = function (buffer) {
        var clone = new Array(buffer.length);
        for (var i = 0; i < buffer.length; i++) {
            clone[i] *= -1;
        }
        return clone;
    };
    return DSP;
})();
var FourierTransform;
(function (FourierTransform) {
    var TransformParameter = (function () {
        function TransformParameter(bufferSize, sampleRate) {
            this.bufferSize = bufferSize;
            this.sampleRate = sampleRate;
            this.bandWidth = (this.sampleRate / 2) / this.bufferSize;
            this.spectrum = new Float32Array(this.bufferSize);
            this.real = new Float32Array(this.bufferSize);
            this.imaginary = new Float32Array(this.bufferSize);
            this.peakBand = 0;
            this.peak = 0;
        }
        TransformParameter.prototype.getBandFrequency = function (index) {
            return this.bandWidth * index + this.bandWidth / 2;
        };

        TransformParameter.prototype.calculateSpectrum = function () {
            var bufferSizeInversed = 1 / this.bufferSize;
            for (var i = 0; i < this.bufferSize; i++) {
                var magnitude = bufferSizeInversed * Math.sqrt(Math.pow(this.real[i], 2) + Math.pow(this.imaginary[i], 2));

                if (magnitude > this.peak) {
                    this.peakBand = i;
                    this.peak = magnitude;
                }

                this.spectrum[i] = magnitude;
            }
        };
        return TransformParameter;
    })();

    var DFT = (function () {
        function DFT(bufferSize, sampleRate) {
            this.bufferSize = bufferSize;
            this.sampleRate = sampleRate;
            this.parameter = new TransformParameter(this.bufferSize, this.sampleRate);
            var sizePow2 = Math.pow(this.bufferSize, 2);
            this.sinTable = new Float32Array(sizePow2);
            this.cosTable = new Float32Array(sizePow2);
            for (var i = 0; i < sizePow2; i++) {
                this.sinTable[i] = Math.sin(i * Math.PI * 2 / bufferSize);
                this.cosTable[i] = -Math.cos(i * Math.PI * 2 / bufferSize);
            }
        }
        DFT.prototype.forward = function (buffer) {
            for (var i = 0; i < this.bufferSize; i++) {
                /*
                Xk = sigma xn * (e^-i2PIkn/N)
                =sigma xn * (cos(-2PIkn/N) + isin(-2PIkn/N)) => Euler's formula
                =sigma xn * (cos(2PIkn/N) - isin(2PIkn/N))
                */
                var real = 0;
                var imaginary = 0;
                for (var i2 = 0; i2 < buffer.length; i++) {
                    real += this.cosTable[i * i2] * buffer[i2];
                    imaginary += this.sinTable[i * i2] * buffer[i2];
                }
                this.parameter.real[i] = real;
                this.parameter.imaginary[i] = imaginary;
            }
            return this.parameter.calculateSpectrum();
        };
        return DFT;
    })();
    FourierTransform.DFT = DFT;

    var FFT = (function () {
        function FFT(bufferSize, sampleRate) {
            this.bufferSize = bufferSize;
            this.sampleRate = sampleRate;
            this.parameter = new TransformParameter(this.bufferSize, this.sampleRate);
            this.reverseTable = new Uint32Array(this.bufferSize);
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
        FFT.prototype.forward = function (buffer) {
            if ((Math.log(this.bufferSize) / Math.LN2) % 1 != 0) {
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
                var phaseShiftStepReal = this.cosTable[halfSize];
                var phaseShiftStepImaginary = this.sinTable[halfSize];

                var currentPhaseShiftReal = 1;
                var currentPhaseShiftImaginary = 0;

                for (var fftStep = 0; fftStep < halfSize; fftStep++) {
                    var i = fftStep;

                    while (i < this.bufferSize) {
                        var off = i + halfSize;

                        //var
                        this.parameter.real;
                    }
                }
            }
            //not completely implemented
        };
        return FFT;
    })();
    FourierTransform.FFT = FFT;
})(FourierTransform || (FourierTransform = {}));
//# sourceMappingURL=dspts.js.map
