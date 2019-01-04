import { cli } from ".";

import { version } from "../../package.json";
import { StubWritableStream } from "./index.stubs";

const createTestArgs = (...argv: string[]) => ({
    argv: ["node.exe", "typestat", ...argv],
    logger: {
        stderr: new StubWritableStream(),
        stdout: new StubWritableStream(),
    },
    mainRunner: jest.fn(),
});

describe("cli", () => {
    it("logs the current version if --version is provided", async () => {
        // Arrange
        const { argv, logger, mainRunner } = createTestArgs("--version");

        // Act
        await cli(argv, { logger, mainRunner });

        // Assert
        expect(logger.stdout.write).toHaveBeenLastCalledWith(`${version}\n`);
    });
});
