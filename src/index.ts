import { htmlify } from "./htmlify";
import { program } from "commander";

program
  .name("htmlify")
  .option("-i, --input <PATH>", "Input JSON directory.", "./assets")
  .option("-o, --output <PATH>", "Output HTML/PDF directory.", "./assets/out")
  .option("--clean", "Delete content in the output directory before starting.")
  .option("--continue", "Resume from a failed operation. (Skips regeneration of existing output files.)")
  .option("--pdf", "Convert HTML in the output directory to PDF.")
  .option("--split", "Split the course content into multiple output files (one per page).")
  .description("CLI to convert course content from a JSON export to HTML.");

program.parse();

const options = program.opts();

(async () => {
  await htmlify({
    continue: options.continue ? true : false,
    inputPath: options.input,
    outputClean: options.clean ? true : false,
    outputPath: options.output,
    outputPdf: options.pdf ? true : false,
    outputSplit: options.split ? true : false,
  });
})();