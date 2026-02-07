/**
 * BOOM CATS - Sound Manager
 * Handles all game audio including background music and sound effects
 */

class SoundManager {
    constructor() {
        this.sounds = {};
        this.musicEnabled = this.loadSetting('musicEnabled', true);
        this.sfxEnabled = this.loadSetting('sfxEnabled', true);
        this.musicVolume = this.loadSetting('musicVolume', 0.3);
        this.sfxVolume = this.loadSetting('sfxVolume', 0.5);
        this.currentMusic = null;
        this.initialized = false;
    }

    loadSetting(key, defaultValue) {
        try {
            const stored = localStorage.getItem(`boomcats_${key}`);
            return stored !== null ? JSON.parse(stored) : defaultValue;
        } catch {
            return defaultValue;
        }
    }

    saveSetting(key, value) {
        try {
            localStorage.setItem(`boomcats_${key}`, JSON.stringify(value));
        } catch (e) {
            console.warn('Could not save setting:', e);
        }
    }

    // Initialize audio context (must be called after user interaction)
    async init() {
        if (this.initialized) return;

        // Create audio elements using Web Audio API compatible URLs
        // Using free sound effects from various sources
        this.sounds = {
            // Background Music - Dark Epic
            bgMusic: this.createOscillatorMusic(),

            // Sound Effects
            cardDraw: this.createTone(440, 0.1, 'sine'),
            cardPlay: this.createTone(523, 0.15, 'triangle'),
            cardSelect: this.createTone(330, 0.08, 'sine'),
            explosion: this.createExplosionSound(),
            defuse: this.createTone(880, 0.3, 'sine', true),
            victory: this.createVictorySound(),
            defeat: this.createDefeatSound(),
            turn: this.createTone(392, 0.1, 'square'),
            shuffle: this.createShuffleSound(),
            nope: this.createTone(200, 0.2, 'sawtooth'),
            attack: this.createTone(150, 0.25, 'sawtooth'),
            skip: this.createTone(600, 0.1, 'triangle'),
            buttonClick: this.createTone(500, 0.05, 'sine'),
            buttonHover: this.createTone(400, 0.03, 'sine'),
        };

        this.initialized = true;
    }

    // Create a simple tone using Web Audio API
    createTone(frequency, duration, type = 'sine', fadeOut = false) {
        return () => {
            if (!this.sfxEnabled) return;

            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.value = frequency;
                oscillator.type = type;
                gainNode.gain.value = this.sfxVolume * 0.3;

                if (fadeOut) {
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
                }

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + duration);
            } catch (e) {
                console.warn('Could not play tone:', e);
            }
        };
    }

    // Create explosion sound effect
    createExplosionSound() {
        return () => {
            if (!this.sfxEnabled) return;

            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const duration = 0.5;

                // Create noise
                const bufferSize = audioContext.sampleRate * duration;
                const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
                const data = buffer.getChannelData(0);

                for (let i = 0; i < bufferSize; i++) {
                    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.1));
                }

                const source = audioContext.createBufferSource();
                source.buffer = buffer;

                const gainNode = audioContext.createGain();
                gainNode.gain.value = this.sfxVolume * 0.5;

                // Add filter for rumble effect
                const filter = audioContext.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.value = 500;

                source.connect(filter);
                filter.connect(gainNode);
                gainNode.connect(audioContext.destination);

                source.start();
            } catch (e) {
                console.warn('Could not play explosion:', e);
            }
        };
    }

    // Create victory fanfare
    createVictorySound() {
        return () => {
            if (!this.sfxEnabled) return;

            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6

                notes.forEach((freq, i) => {
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();

                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);

                    oscillator.frequency.value = freq;
                    oscillator.type = 'triangle';
                    gainNode.gain.value = this.sfxVolume * 0.2;
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3 + (i * 0.15));

                    oscillator.start(audioContext.currentTime + (i * 0.15));
                    oscillator.stop(audioContext.currentTime + 0.5 + (i * 0.15));
                });
            } catch (e) {
                console.warn('Could not play victory:', e);
            }
        };
    }

    // Create defeat sound
    createDefeatSound() {
        return () => {
            if (!this.sfxEnabled) return;

            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const notes = [400, 350, 300, 250]; // Descending

                notes.forEach((freq, i) => {
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();

                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);

                    oscillator.frequency.value = freq;
                    oscillator.type = 'sawtooth';
                    gainNode.gain.value = this.sfxVolume * 0.15;
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4 + (i * 0.2));

                    oscillator.start(audioContext.currentTime + (i * 0.2));
                    oscillator.stop(audioContext.currentTime + 0.5 + (i * 0.2));
                });
            } catch (e) {
                console.warn('Could not play defeat:', e);
            }
        };
    }

    // Create shuffle sound
    createShuffleSound() {
        return () => {
            if (!this.sfxEnabled) return;

            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();

                for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        const oscillator = audioContext.createOscillator();
                        const gainNode = audioContext.createGain();

                        oscillator.connect(gainNode);
                        gainNode.connect(audioContext.destination);

                        oscillator.frequency.value = 200 + Math.random() * 200;
                        oscillator.type = 'triangle';
                        gainNode.gain.value = this.sfxVolume * 0.1;

                        oscillator.start(audioContext.currentTime);
                        oscillator.stop(audioContext.currentTime + 0.05);
                    }, i * 50);
                }
            } catch (e) {
                console.warn('Could not play shuffle:', e);
            }
        };
    }

    // Create dark ambient background music using oscillators
    createOscillatorMusic() {
        let isPlaying = false;
        let oscillators = [];
        let audioContext = null;
        let gainNode = null;

        return {
            play: () => {
                if (isPlaying || !this.musicEnabled) return;

                try {
                    audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    gainNode = audioContext.createGain();
                    gainNode.gain.value = this.musicVolume * 0.15;
                    gainNode.connect(audioContext.destination);

                    // Create dark ambient drone
                    const frequencies = [55, 82.5, 110, 165]; // A1, E2, A2, E3

                    frequencies.forEach((freq, i) => {
                        const osc = audioContext.createOscillator();
                        const oscGain = audioContext.createGain();

                        osc.type = i < 2 ? 'sine' : 'triangle';
                        osc.frequency.value = freq;

                        // Add subtle vibrato
                        const lfo = audioContext.createOscillator();
                        const lfoGain = audioContext.createGain();
                        lfo.frequency.value = 0.5 + (i * 0.1);
                        lfoGain.gain.value = 2;
                        lfo.connect(lfoGain);
                        lfoGain.connect(osc.frequency);
                        lfo.start();

                        oscGain.gain.value = 0.3 / (i + 1);
                        osc.connect(oscGain);
                        oscGain.connect(gainNode);
                        osc.start();

                        oscillators.push({ osc, lfo, oscGain });
                    });

                    isPlaying = true;
                } catch (e) {
                    console.warn('Could not play music:', e);
                }
            },

            stop: () => {
                if (!isPlaying) return;

                try {
                    oscillators.forEach(({ osc, lfo }) => {
                        osc.stop();
                        lfo.stop();
                    });
                    oscillators = [];

                    if (audioContext) {
                        audioContext.close();
                        audioContext = null;
                    }

                    isPlaying = false;
                } catch (e) {
                    console.warn('Could not stop music:', e);
                }
            },

            setVolume: (vol) => {
                if (gainNode) {
                    gainNode.gain.value = vol * 0.15;
                }
            },

            isPlaying: () => isPlaying
        };
    }

    // Play a sound effect
    play(soundName) {
        if (!this.initialized) {
            this.init();
        }

        const sound = this.sounds[soundName];
        if (sound) {
            if (typeof sound === 'function') {
                sound();
            } else if (sound.play) {
                // It's the music object
                return;
            }
        }
    }

    // Start background music
    startMusic() {
        if (!this.initialized) {
            this.init();
        }

        if (this.sounds.bgMusic && this.musicEnabled) {
            this.sounds.bgMusic.play();
            this.currentMusic = this.sounds.bgMusic;
        }
    }

    // Stop background music
    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic = null;
        }
    }

    // Toggle music
    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        this.saveSetting('musicEnabled', this.musicEnabled);

        if (this.musicEnabled) {
            this.startMusic();
        } else {
            this.stopMusic();
        }

        return this.musicEnabled;
    }

    // Toggle sound effects
    toggleSfx() {
        this.sfxEnabled = !this.sfxEnabled;
        this.saveSetting('sfxEnabled', this.sfxEnabled);
        return this.sfxEnabled;
    }

    // Set music volume
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        this.saveSetting('musicVolume', this.musicVolume);

        if (this.currentMusic && this.currentMusic.setVolume) {
            this.currentMusic.setVolume(this.musicVolume);
        }
    }

    // Set SFX volume
    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        this.saveSetting('sfxVolume', this.sfxVolume);
    }

    // Get current settings
    getSettings() {
        return {
            musicEnabled: this.musicEnabled,
            sfxEnabled: this.sfxEnabled,
            musicVolume: this.musicVolume,
            sfxVolume: this.sfxVolume
        };
    }
}

// Create singleton instance
const soundManager = new SoundManager();

export default soundManager;
