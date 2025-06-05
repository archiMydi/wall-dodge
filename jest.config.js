import { pathsToModuleNameMapper } from "ts-jest";
import { readFileSync } from "fs";
import { parse } from "jsonc-parser";
import { resolve } from "path";

const tsconfig = parse(readFileSync(resolve("tsconfig.json"), "utf8"));

export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "jsdom",
  extensionsToTreatAsEsm: [".ts"],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  moduleNameMapper: tsconfig.compilerOptions?.paths
    ? pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
        prefix: "<rootDir>/",
      })
    : {},
  transform: {},
};
