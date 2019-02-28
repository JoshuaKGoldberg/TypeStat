import { ResultStatus } from "..";
import { version } from "../../package.json";

import { StubWritableStream } from "./index.stubs";
import { runCli } from "./runCli";

const createTestArgs = (...argv: string[]) => ({
    argv: ["node.exe", "typestat", ...argv],
    logger: {
        stderr: new StubWritableStream(),
        stdout: new StubWritableStream(),
    },
    mainRunner: jest.fn(),
});

describe("runCli", () => {
    it("logs the current version when --version is provided", async () => {
        // Arrange
        const { argv, logger, mainRunner } = createTestArgs("--version");

        // Act
        const resultStatus = await runCli(argv, { logger, mainRunner });

        // Assert
        expect(logger.stdout.write).toHaveBeenLastCalledWith(`${version}\n`);
        expect(resultStatus).toEqual(ResultStatus.Succeeded);
    });

    it("logs an error when the main runner rejects with one", async () => {
        // Arrange
        const { argv, logger, mainRunner } = createTestArgs();
        const message = "Error message";

        mainRunner.mockRejectedValue(new Error(message));

        // Act
        const resultStatus = await runCli(argv, { logger, mainRunner });

        // Assert
        expect(logger.stderr.write).toHaveBeenLastCalledWith(jasmine.stringMatching(message));
        expect(resultStatus).toEqual(ResultStatus.Failed);
    });

    it("logs help and the error when a configuration error is reported", async () => {
        // Arrange
        const { argv, logger, mainRunner } = createTestArgs();
        const message = "Error message";

        mainRunner.mockResolvedValue({
            error: message,
            status: ResultStatus.ConfigurationError,
        });

        // Act
        const resultStatus = await runCli(argv, { logger, mainRunner });

        // Assert
        expect(logger.stdout.write).toHaveBeenLastCalledWith(jasmine.stringMatching("typestat \\[options\\]"));
        expect(logger.stderr.write).toHaveBeenLastCalledWith(jasmine.stringMatching(message));
        expect(resultStatus).toEqual(ResultStatus.ConfigurationError);
    });
});
