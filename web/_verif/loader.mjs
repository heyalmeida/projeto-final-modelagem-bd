import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

/**
 * Loader de verificação: resolve os aliases `@/` do projeto, transpila TS/TSX
 * com o TypeScript instalado e substitui as APIs de navegação do Next por mocks.
 */

const root = process.cwd();
const SRC = path.join(root, "src");
const MOCKS = path.join(root, "_verif", "mocks");

const MOCK_MAP = {
  "next/link": path.join(MOCKS, "next-link.tsx"),
  "next/image": path.join(MOCKS, "next-image.tsx"),
  "next/navigation": path.join(MOCKS, "next-navigation.ts"),
};

function probe(base) {
  const candidates = [base, `${base}.ts`, `${base}.tsx`, `${base}.mjs`, path.join(base, "index.ts"), path.join(base, "index.tsx")];
  return candidates.find((candidate) => existsSync(candidate) && statSync(candidate).isFile());
}

export async function resolve(specifier, context, nextResolve) {
  if (MOCK_MAP[specifier]) {
    return { url: pathToFileURL(MOCK_MAP[specifier]).href, shortCircuit: true };
  }
  if (specifier.startsWith("@/")) {
    const target = probe(path.join(SRC, specifier.slice(2)));
    if (target) return { url: pathToFileURL(target).href, shortCircuit: true };
  }
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url.startsWith("file:") && (url.endsWith(".ts") || url.endsWith(".tsx"))) {
    const filePath = fileURLToPath(url);
    const source = readFileSync(filePath, "utf8");
    const { outputText } = ts.transpileModule(source, {
      fileName: filePath,
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
      },
    });
    return { format: "module", source: outputText, shortCircuit: true };
  }
  return nextLoad(url, context);
}