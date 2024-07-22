import { htmlify } from "./htmlify";
import { program } from "commander";

program
  .name("htmlify")
  .option("-i, --input <PATH>", "Input JSON directory.", "./assets")
  .option("-o, --output <PATH>", "Output HTML directory.", "./assets/out")
  .option("--pdf", "Convert the HTML output to PDF.")
  .description("CLI to convert courses from a JSON export to HTML.");

program.parse();

const options = program.opts();

(async () => {
  await htmlify({
    inputPath: options.input,
    outputPath: options.output,
    outputPdf: options.pdf ? true : false,
  });
})();