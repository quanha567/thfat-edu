export async function buildBackend(): Promise<void> {
  await Bun.build({
    entrypoints: ["src/index.ts"],
    outdir: "dist",
    target: "node",
    format: "esm",
  });

  const jsContent = await Bun.file("dist/index.js").text();
  await Bun.write("dist/index.mjs", jsContent);
  await Bun.write("dist/package.json", JSON.stringify({ type: "module" }, null, 2));
}

await buildBackend();
