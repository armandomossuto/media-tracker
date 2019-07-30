module.exports = {

  roots: ["<rootDir>/src/app/"],

  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },

  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  snapshotSerializers: ["enzyme-to-json/serializer"],
  setupTestFrameworkScriptFile: "<rootDir>/src/tests/setupEnzyme.ts",

  moduleDirectories: ['node_modules', 'src/app']

}