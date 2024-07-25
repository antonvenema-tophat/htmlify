import { htmlify } from "./htmlify";
import { program } from "commander";

program
  .name("htmlify")
  .option("-i, --input <PATH>", "Input JSON directory.", "./assets")
  .option("-o, --output <PATH>", "Output HTML directory.", "./assets/out")
  .option("--clean", "Clean the output directory first.")
  .option("--pdf", "Convert the HTML output to PDF.")
  .option("--split", "Split the course content into individual pages.")
  .description("CLI to convert course content from a JSON export to HTML.");

program.parse();

const options = program.opts();

(async () => {
  await htmlify({
    inputPath: options.input,
    outputClean: options.clean ? true : false,
    outputPath: options.output,
    outputPdf: options.pdf ? true : false,
    outputSplit: options.split ? true : false,
  });
})();