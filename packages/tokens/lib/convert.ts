import fs from "node:fs";
import { resolve } from "node:path";
import input from "./input.json";

const DIRNAME = resolve();

type JSONResult = {
  base: (typeof input)["base"]["mode1"];
  semantic: {
    dark: (typeof input)["semantic"]["dARKMODE"];
    light: (typeof input)["semantic"]["lIGHTMODE"];
  };
};

const createTokens = async () => {
  let cssResult = "";
  const jsonResult = {
    base: {},
    semantic: { dark: {}, light: {} },
  } as JSONResult;

  let baseKey: keyof (typeof input)["base"]["mode1"];

  let cssBase = ":root {\n";
  for (baseKey in input["base"]["mode1"]) {
    const item = input["base"]["mode1"][baseKey];
    cssBase += `  --ds-${baseKey
      .replace(/([A-Z]|(?<=\D)[1-9])/g, "-$1")
      .toLowerCase()}: ${item};\n`;

    jsonResult.base[baseKey] = item;
  }
  cssBase += "}\n";

  let semanticKey: keyof (typeof input)["semantic"]["dARKMODE"];
  let cssSemanticLight = ".light {\n";
  for (semanticKey in input["semantic"]["lIGHTMODE"]) {
    const item = input["semantic"]["lIGHTMODE"][semanticKey];
    cssSemanticLight += `  --ds-${semanticKey
      .replace(/([A-Z]|(?<=\D)[1-9])/g, "-$1")
      .toLowerCase()}: ${item};\n`;

    jsonResult.semantic.light[semanticKey] = item;
  }
  cssSemanticLight += "}\n";

  let cssSemanticDark = ".dark {\n";
  for (semanticKey in input["semantic"]["dARKMODE"]) {
    const item = input["semantic"]["dARKMODE"][semanticKey];
    cssSemanticDark += `  --ds-${semanticKey
      .replace(/([A-Z]|(?<=\D)[1-9])/g, "-$1")
      .toLowerCase()}: ${item};\n`;

    jsonResult.semantic.dark[semanticKey] = item;
  }
  cssSemanticDark += "}\n";

  cssResult = cssBase + "\n\n" + cssSemanticLight + "\n\n" + cssSemanticDark;

  await fs.promises.writeFile(resolve(DIRNAME, "./lib/tokens.css"), cssResult);
  await fs.promises.writeFile(
    resolve(DIRNAME, "./lib/tokens.json"),
    JSON.stringify(jsonResult, null, 2)
  );
};

createTokens();
