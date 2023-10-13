"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const utils_1 = require("../utils");
function eslintRelatedChanges(options) {
    return (0, schematics_1.chain)([
        // Update the lint builder and config in angular.json
        (0, utils_1.addESLintTargetToProject)(options.name, 'lint'),
        // Create the ESLint config file for the project
        (0, utils_1.createESLintConfigForProject)(options.name),
        // Delete the TSLint config file for the project
        (0, utils_1.removeTSLintJSONForProject)(options.name),
    ]);
}
function default_1(options) {
    return (host, context) => {
        return (0, schematics_1.chain)([
            (0, schematics_1.externalSchematic)('@schematics/angular', 'application', options),
            eslintRelatedChanges(options),
        ])(host, context);
    };
}
exports.default = default_1;
