import { WaveTracker } from "./WaveTracker";

describe("WaveTracker", () => {
    describe("addAndCheck", () => {
        it("returns false for first wave hash", () => {
            // Arrange
            const waveTracker = new WaveTracker();

            // Act
            const result = waveTracker.addAndCheck({ a: [] });

            // Assert
            expect(result).toBe(false);
        });

        it("returns false for a second, new wave hash", () => {
            // Arrange
            const waveTracker = new WaveTracker();
            waveTracker.addAndCheck({ a: [] });

            // Act
            const result = waveTracker.addAndCheck({ b: [] });

            // Assert
            expect(result).toBe(false);
        });

        it("returns false for a second, duplicate wave hash", () => {
            // Arrange
            const waveTracker = new WaveTracker();
            waveTracker.addAndCheck({ a: [] });

            // Act
            const result = waveTracker.addAndCheck({ a: [] });

            // Assert
            expect(result).toBe(false);
        });

        it("returns true for a duplicate number wave at the threshold", () => {
            // Arrange
            const waveTracker = new WaveTracker();

            for (let i = 0; i < 25; i += 1) {
                waveTracker.addAndCheck({ a: [] });
            }

            // Act
            const result = waveTracker.addAndCheck({ a: [] });

            // Assert
            expect(result).toBe(true);
        });

        it("returns false for a duplicate number wave interrupted before at the threshold", () => {
            // Arrange
            const waveTracker = new WaveTracker();

            for (let i = 0; i < 10; i += 1) {
                waveTracker.addAndCheck({ a: [] });
            }
            waveTracker.addAndCheck({ b: [] });

            for (let i = 0; i < 15; i += 1) {
                waveTracker.addAndCheck({ a: [] });
            }

            // Act
            const result = waveTracker.addAndCheck({ a: [] });

            // Assert
            expect(result).toBe(false);
        });

        it("returns true for a duplicate number wave resumed before at the threshold", () => {
            // Arrange
            const waveTracker = new WaveTracker();

            for (let i = 0; i < 10; i += 1) {
                waveTracker.addAndCheck({ a: [] });
            }
            waveTracker.addAndCheck({ b: [] });

            for (let i = 0; i < 24; i += 1) {
                waveTracker.addAndCheck({ a: [] });
            }

            // Act
            const result = waveTracker.addAndCheck({ a: [] });

            // Assert
            expect(result).toBe(true);
        });
    });
});
