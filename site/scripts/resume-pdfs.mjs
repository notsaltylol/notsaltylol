import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

// Prebuilt PDFs deploy on static hosts. Fail the build if content has changed
// without regeneration, rather than serve a download that differs from the page.
export default function resumePdfs() {
  return {
    name: "resume-pdfs",
    hooks: {
      "astro:build:start": () => {
        const source = readFileSync(
          new URL("../src/content/resume.json", import.meta.url),
        );
        const content = JSON.parse(source.toString());
        const manifest = JSON.parse(
          readFileSync(
            new URL("../public/resumes/manifest.json", import.meta.url),
            "utf8",
          ),
        );
        const hash = (value) =>
          createHash("sha256").update(value).digest("hex");
        const generator = readFileSync(
          new URL("./generate-resume-pdfs.py", import.meta.url),
        );
        if (
          hash(source) !== manifest.sourceSha256 ||
          hash(generator) !== manifest.generatorSha256
        ) {
          throw new Error(
            "Résumé PDFs are stale. Run python3 scripts/generate-resume-pdfs.py before building.",
          );
        }
        for (const variant of content.variants) {
          const file = manifest.files.find((item) => item.focus === variant.id);
          if (!file || file.pages !== 1)
            throw new Error(`Missing one-page résumé PDF: ${variant.id}`);
          const pdf = readFileSync(
            new URL(`../public/resumes/${file.filename}`, import.meta.url),
          );
          if (hash(pdf) !== file.sha256)
            throw new Error(
              `Résumé PDF has changed: ${variant.id}. Regenerate the PDFs.`,
            );
        }
      },
    },
  };
}
