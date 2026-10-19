import * as esbuild from "esbuild";
import { cpSync } from "node:fs";

const options = {
  entryPoints: ["src/content.ts"],
  bundle: true,
  outfile: "dist/content.js",
  target: "es2022",
  format: "iife",
  plugins: [
    {
      name: "copy-static",
      setup(build) {
        build.onEnd(() => cpSync("static", "dist", { recursive: true }));
      },
    },
  ],
};

if (process.argv.includes("--watch")) {
  const context = await esbuild.context(options);
  await context.watch();
  console.log("watching src/ and static/");
} else {
  await esbuild.build(options);
}
