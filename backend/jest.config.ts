/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";
import { pathsToModuleNameMapper } from "ts-jest";
import tsconfig from "./tsconfig.json";
const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths),
    modulePaths: ["<rootDir>"],
};

export default config;
