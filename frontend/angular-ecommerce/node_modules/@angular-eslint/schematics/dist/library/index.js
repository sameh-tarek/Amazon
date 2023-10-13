"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const utils_1 = require("../utils");
function eslintRelatedChanges(options) {
    /**
     * The types coming from the @schematics/angular schema seem to be wrong, if name isn't
     * provided the interactive CLI prompt will throw
     */
    const projectName = options.name;
    return (0, schematics_1.chain)([
        // Update the lint builder and config in angular.json
        (0, utils_1.addESLintTargetToProject)(projectName, 'lint'),
        // Create the ESLint config file for the project
        (0, utils_1.createESLintConfigForProject)(projectName),
        // Delete the TSLint config file for the project
        (0, utils_1.removeTSLintJSONForProject)(projectName),
    ]);
}
function default_1(options) {
    return (host, context) => {
        return (0, schematics_1.chain)([
            (0, schematics_1.externalSchematic)('@schematics/angular', 'library', options),
            eslintRelatedChanges(options),
        ])(host, context);
    };
}
exports.default = default_1;
