/*
 * Attribution Notice:
 * This file is a derivative work of the Form.io project (https://github.com/formio/formio),
 * based on version v4.2.8-rc.2, and has been modified.
 * Original work: Copyright (c) 2020 Form.io LLC
 * Licensed under the Open Software License version 3.0.
 */

'use strict';
const _ = require('lodash');
const { ProcessTargets, process, interpolateErrors, serverRules } = require('@formio/core');
const { evaluateProcess } = require('@formio/vm');
const fetch = require('@formio/node-fetch-http-proxy');

/**
 * @TODO: Isomorphic validation system.
 *
 * @param form
 * @param model
 * @constructor
 */
class Validator {
    constructor(form, tokens, hook, options) {
        this.logger = options.logger;
        this.form = form;
        this.tokens = tokens;
        this.hook = hook;
        this.options = options;
    }

    addPathQueryParams(pathQueryParams, query, path) {
        const pathArray = path.split(/\[\d+\]?./);
        const needValuesInArray = pathArray.length > 1;
        let pathToValue = path;
        if (needValuesInArray) {
            pathToValue = pathArray.shift();
            const pathQueryObj = {};
            _.reduce(
                pathArray,
                (pathQueryPath, pathPart, index) => {
                    const isLastPathPart = index === pathArray.length - 1;
                    const obj = _.get(pathQueryObj, pathQueryPath, pathQueryObj);
                    const addedPath = `$elemMatch['${pathPart}']`;
                    _.set(obj, addedPath, isLastPathPart ? pathQueryParams : {});
                    return pathQueryPath ? `${pathQueryPath}.${addedPath}` : addedPath;
                },
                ''
            );
            query[pathToValue] = pathQueryObj;
        } else {
            query[pathToValue] = pathQueryParams;
        }
    }

    async dereferenceDataTableComponent(component) {
        if (
            component.type !== 'datatable' ||
            !component.fetch ||
            component.fetch.dataSrc !== 'resource' ||
            !component.fetch.resource
        ) {
            return [];
        }

        const resourceId = component.fetch.resource;
        const resource = await this.formModel.findOne({
            _id: resourceId,
            deleted: null,
        });
        if (!resource) {
            throw new Error(`Resource at ${resourceId} not found for dereferencing`);
        }
        return resource.components || [];
    }

    /**
     * Validate a submission for a form.
     *
     * @param {Object} submission
     *   The data submission object.
     * @param next
     *   The callback function to pass the results.
     */
    async validate(submission, next) {
        this.logger?.debug?.('Starting validation', { module: 'Validator' });

        // Skip validation if no data is provided.
        if (!submission.data) {
            this.logger?.debug?.('No data skipping validation', {
                module: 'Validator',
            });
            return next();
        }

        let config = this.project ? this.project.config || {} : {};
        config = { ...(this.form.config || {}), ...config };

        const context = {
            form: this.form,
            submission: submission,
            components: this.form.components,
            data: submission.data,
            processors: [],
            fetch,
            scope: {},
            config: {
                ...(config || {}),
                // headers: JSON.parse(JSON.stringify(this.req.headers)),
                server: true,
                token: this.tokens?.['x-jwt-token'],
                tokens: this.tokens,
                database: this.hook.alter(
                    'validationDatabaseHooks',
                    {
                        // Simplified database hooks - no actual database operations
                        isUnique: async (_context, _value) => {
                            this.logger?.debug?.(
                                'Unique validation requested but no database available - returning true',
                                { module: 'Validator' }
                            );
                            return true; // Always pass unique validation since we have no database
                        },
                        dereferenceDataTableComponent: this.dereferenceDataTableComponent.bind(this),
                    },
                    this
                ),
            },
        };
        try {
            // Process the server processes
            context.processors = ProcessTargets.submission;
            context.rules = this.hook.alter('serverRules', serverRules);
            await process(context);
            submission.data = context.data;

            const additionalDeps = this.hook.alter('dynamicVmDependencies', [], this.form);

            this.logger?.debug?.('OPTIONS', { ...this.options, module: 'Validator' });

            // Process the evaulator
            const { scope, data } = await evaluateProcess({
                ...(config || {}),
                form: this.form,
                submission,
                scope: context.scope,
                token: this.tokens?.['x-jwt-token'],
                tokens: this.tokens,
                timeout: this.options?.vmTimeout || 5000,
                additionalDeps,
            });
            context.scope = scope;
            submission.data = data;
            submission.scope = scope;

            // Now that the validation is complete, we need to remove fetched data from the submission.
            for (const path in context.scope.fetched) {
                _.unset(submission.data, path);
            }
        } catch (err) {
            if (err.message) {
                this.logger?.error?.(err.message, { module: 'Validator' });
            } else {
                this.logger?.error?.({ err, module: 'Validator' });
            }
            return next(err.message || err);
        }

        // If there are errors, return the errors.
        if (context.scope.errors && context.scope.errors.length) {
            return next({
                name: 'ValidationError',
                details: interpolateErrors(context.scope.errors),
            });
        }

        return next(null, submission.data, this.form.components);
    }
}

module.exports = Validator;
