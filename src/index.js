/*
 * Attribution Notice:
 * This file is a derivative work of the Form.io project (https://github.com/formio/formio),
 * based on version v4.2.8-rc.2, and has been modified.
 * Original work: Copyright (c) 2020 Form.io LLC
 * Licensed under the Open Software License version 3.0.
 */

'use strict';

const { configureVm } = require('@formio/vm');
const Validator = require('./resources/Validator');
const formio = { hooks: {} };
const hook = require('./util/hook')(formio);

/**
 * Formio Submission Data Validator
 * Handles validation of form submissions against external form definitions
 */
class FormioSubmissionDataValidator {
    constructor(options = {}) {
        this.logger = options.logger;
        this.options = options;
        // Setup VM evaluator for secure validation
        this.setupEvaluator(options);
    }

    /**
     * Setup the isolated VM evaluator for secure validation
     * @param {Object} options - Configuration options
     */
    setupEvaluator(options) {
        // Read the static VM dependencies into memory and configure the VM
        const { lodash, moment, inputmask, core, fastJsonPatch, nunjucks } = require('./util/staticVmDependencies');
        configureVm({
            dependencies: {
                lodash,
                moment,
                inputmask,
                core,
                fastJsonPatch,
                nunjucks,
            },
            timeout: options.vmTimeout || 5000,
        });

        this.logger?.debug?.(`VM evaluator configured with timeout: ${options.vmTimeout || 5000}`);
    }

    /**
     * Validate form submission data against a form definition from an external URL
     * @param {string} form - URL to fetch the form definition from
     * @param {Object} submissionData - The submission data to validate
     * @param {Object} options - Additional validation options
     * @returns {Promise<Object>} Validation result
     */
    async validateSubmission(form, submissionData, options = {}) {
        try {
            this.logger?.debug?.('Validating submission data against form', {
                module: 'FormioSubmissionDataValidator',
            });

            //Prepare submission object
            const submission = {
                data: submissionData,
                ...options.submissionMeta,
            };

            // Validate the request.
            const validator = new Validator(form, options.tokens, hook, { ...this.options, ...options });

            let result;
            // Perform validation
            await validator.validate(submission, (err, _data, _visibleComponents) => {
                if (err) {
                    result = { valid: false, errors: err };
                    return;
                }

                result = { valid: true };
            });

            this.logger?.info?.('Validation completed.', {
                module: 'FormioSubmissionDataValidator',
                succeeded: result.valid,
                errors: result.errors,
            });

            return {
                success: result.valid,
                errors: result.errors,
                timestamp: new Date().toISOString(),
            };
        } catch (error) {
            this.logger?.error?.('Validation service error.', { module: 'FormioSubmissionDataValidator', error });

            return {
                success: false,
                error: {
                    message: error.message,
                    type: error.constructor.name,
                },
                timestamp: new Date().toISOString(),
            };
        }
    }
}

module.exports = FormioSubmissionDataValidator;
