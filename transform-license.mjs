import { promises } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const licenses = JSON.parse(await readInput());

const libraries = licenses.third_party_libraries
  // Do not include license if using Unlicense
  .filter(({ license }) => !license.includes("Unlicense"));

const librariesWithCompactLicenses = libraries.map((library) => {
  const includesMIT = library.license.includes("MIT");

  return {
    ...library,
    licenses: library.licenses.filter(({ license }) => {
      // If licenses under multiple compatible licenses, only include MIT
      return !includesMIT || !["0BSD", "Apache-2.0", "Zlib"].includes(license);
    }),
  };
});

const licensesSummary = librariesWithCompactLicenses
  .map(({ licenses }) => licenses.map(({ license }) => license))
  .flat();

const licensesSummaryUniq = [...new Set(licensesSummary)];

const licensesText = librariesWithCompactLicenses
  .map(
    (library) => `* ${library.package_name} ${library.package_version}

${library.licenses.map(({ text }) => text).join("\n\n")}`
  )
  .join("\n\n");

await promises.writeFile(
  path.join(__dirname, "LICENSE-THIRD-PARTY"),
  `The wasm binaries contains code from multiple third party libraries.

Summary of licenses used:
${licensesSummaryUniq.map(
  (license) => `
- ${license}`
)}

Libraries:

${licensesText}`,
  "utf-8"
);

function readInput() {
  return new Promise((resolve) => {
    let data = "";

    process.stdin.on("readable", () => {
      let chunk;
      while (null !== (chunk = process.stdin.read())) {
        data += chunk;
      }
    });

    process.stdin.on("end", () => {
      resolve(data);
    });
  });
}
