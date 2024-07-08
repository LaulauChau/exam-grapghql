import type { CodegenConfig } from "@graphql-codegen/cli";

const config = {
  schema: "./src/schema.graphql",
  documents: ["../../apps/web/src/**/*.ts", "../../apps/web/src/**/*.tsx"],
  ignoreNoDocuments: true,
  overwrite: true,
  generates: {
    "./src/gql/": {
      preset: "client",
      config: {
        useTypeImports: true,
      },
    },
  },
} as CodegenConfig;

export default config;
