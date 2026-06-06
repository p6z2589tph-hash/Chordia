// Tuner JavaScript

let audioContext;
let analyser;
let dataArray;
let isListening = false;

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const baseFrequencies = {
    'E': 82.41,
    'A': 110.00,
    'D': 146.83,
    'G': 196.00,
    'B': 246.94
};

document.addEventListener('DOMContentLoaded', function() {
    const micButton = document.getElementById('micButton');
    const stringButtons = document.querySelectorAll('.string-btn');

    if (micButton) {
        micButton.addEventListener('click', toggleTuner);
    }

    stringButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const note = this.getAttribute('data-note');
            playNote(note);
        });
    });
});

function toggleTuner() {
    const micButton = document.getElementById('micButton');
    
    if (isListening) {
        stopTuner();
        micButton.innerHTML = '<i class="fas fa-microphone"></i><span>Start Tuning</span>';
        isListening = false;
    } else {
        startTuner();
        micButton.innerHTML = '<i class="fas fa-microphone"></i><span>Stop Tuning</span>';
        isListening = true;
    }
}

function startTuner() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 4096;
    
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            detectPitch();
        })
        .catch(error => {
            console.error('Microphone access denied:', error);
            alert('Please allow microphone access to use the tuner.');
        });
}

function stopTuner() {
    if (audioContext) {
        audioContext.close();
    }
}

function detectPitch() {
    if (!isListening) return;

    dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);

    const frequency = autoCorrelate(dataArray, audioContext.sampleRate);

    if (frequency > 0) {
        updateDisplay(frequency);
    }

    requestAnimationFrame(detectPitch);
}

function autoCorrelate(buffer, sampleRate) {
    const MAX_SAMPLES = Math.floor(buffer.length / 2);
    let best_offset = -1;
    let best_correlation = 0;
    let rms = 0;

    // Calculate RMS
    for (let i = 0; i < buffer.length; i++) {
        const val = buffer[i] / 255;
        rms += val * val;
    }
    rms = Math.sqrt(rms / buffer.length);

    if (rms < 0.01) return -1;

    // Find the best correlation offset
    let lastCorrelation = 1;
    for (let offset = 1; offset < MAX_SAMPLES; offset++) {
        let correlation = 0;
        for (let i = 0; i < MAX_SAMPLES; i++) {
            correlation += Math.abs(buffer[i] / 255 - buffer[i + offset] / 255);
        }
        correlation = 1 - (correlation / MAX_SAMPLES);
        if (correlation > 0.9 && correlation > lastCorrelation) {
            let foundGoodCorrelation = false;
            if (correlation > best_correlation) {
                best_correlation = correlation;
                best_offset = offset;
                foundGoodCorrelation = true;
            }
            if (foundGoodCorrelation) {
                const shift = (buffer[best_offset + 1] / 255 - buffer[best_offset] / 255) * (buffer.length - 1);
                return sampleRate / (best_offset + 8 * shift);
            }
        }
        lastCorrelation = correlation;
    }
    if (best_correlation > 0.01) {
        return sampleRate / best_offset;
    }
    return -1;
}

function updateDisplay(frequency) {
    const noteValue = document.getElementById('noteValue');
    const noteStatus = document.getElementById('noteStatus');
    const centsValue = document.getElementById('centsValue');
    const meterNeedle = document.getElementById('meterNeedle');

    const note = getNote(frequency);
    const cents = getCents(frequency, note);

    noteValue.textContent = note;
    centsValue.textContent = Math.round(cents);

    // Update needle position
    const needleRotation = Math.max(-25, Math.min(25, cents / 2));
    meterNeedle.style.transform = `translateX(-50%) rotate(${needleRotation}deg)`;

    // Update status
    if (Math.abs(cents) < 5) {
        noteStatus.textContent = '✓ In Tune';
        noteStatus.style.color = 'var(--primary-color)';
    } else if (cents > 0) {
        noteStatus.textContent = '↓ Too High';
        noteStatus.style.color = 'var(--warning)';
    } else {
        noteStatus.textContent = '↑ Too Low';
        noteStatus.style.color = 'var(--danger)';
    }
}

function getNote(frequency) {
    const A4 = 440;
    const C0 = A4 * Math.pow(2, -4.75);
    const halfStepsFromC0 = 12 * Math.log2(frequency / C0);
    const noteIndex = Math.round(halfStepsFromC0) % 12;
    return notes[noteIndex];
}

function getCents(frequency, note) {
    const A4 = 440;
    const C0 = A4 * Math.pow(2, -4.75);
    const noteIndex = notes.indexOf(note);
    const expectedFrequency = C0 * Math.pow(2, noteIndex / 12);
    const cents = 1200 * Math.log2(frequency / expectedFrequency);
    return cents;
}

function playNote(note) {
    alert(`Playing reference tone for ${note}`);
}
