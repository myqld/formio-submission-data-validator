type Logger = {
    /** Called for debug-level logs. */
    debug?(message: string, context?: { [key: string]: unknown }): void;
    /** Called for informational logs. */
    info?(message: string, context?: { [key: string]: unknown }): void;
    /** Called for warnings. */
    warn?(message: string, context?: { [key: string]: unknown }): void;
    /** Called for errors. */
    error?(message: string, context?: { [key: string]: unknown }): void;
};

type FormioSubmissionDataValidatorOptions = {
    /** Optional custom logger (Pino, console, etc.). */
    logger?: Logger;
    /** Timeout in milliseconds for the VM evaluator (default: 5000). */
    vmTimeout?: number;
    /** Optional tokens passed to the validator. */
    tokens?: any;
    /** Any additional options forwarded to the underlying validator. */
    [key: string]: any;
};

declare class FormioSubmissionDataValidator {
    /**
     * Creates a new FormioSubmissionDataValidator.
     * @param options Optional configuration for the validator.
     */
    constructor(options?: FormioSubmissionDataValidatorOptions);

    /**
     * Validate form submission data against a form definition from an external URL.
     * @param form URL to fetch the form definition from.
     * @param submissionData The submission data to validate.
     * @param options Additional validation options.
     * @returns Promise resolving to a validation result.
     */
    validateSubmission(
        form: string,
        submissionData: Record<string, any>,
        options?: ValidationServiceOptions
    ): Promise<
        | {
              success: boolean;
              // Validation errors
              errors?: any;
              timestamp: string;
          }
        | {
              success: false;
              // Runtime exception
              error: {
                  message: string;
                  type: string;
              };
              timestamp: string;
          }
    >;
}

/** Default export (CommonJS-compatible). */
export = FormioSubmissionDataValidator;
