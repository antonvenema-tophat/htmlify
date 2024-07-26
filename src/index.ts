import { htmlify } from "./htmlify";
import { program } from "commander";

program
  .name("htmlify")
  .option("--input <PATH>", "Path to folder containing input JSON files.", "./assets")
  .option("--output-html <PATH>", "Path to folder for output HTML files.", "./out/html")
  .option("--output-pdf <PATH>", "Path to folder for output PDF files.", "./out/pdf")
  .option("--clean", "Delete content in the output folders before starting.")
  .option("--continue", "Resume from a failed operation. (Skips regeneration of existing output files.)")
  .option("--drop-embedded", "Drops EMBEDDED content while converting.")
  .option("--drop-iframe", "Drops IFRAME content while converting.")
  .option("--drop-image", "Drops IMAGE content while converting.")
  .option("--drop-learning-tool", "Drops LEARNING_TOOL content while converting.")
  .option("--drop-video", "Drops VIDEO content while converting.")
  .option("--no-pdf", "Skips PDF generation.")
  .option("--split", "Split the course content into multiple output files (one per page).")
  .description("CLI to convert course content from a JSON export to HTML.");

program.parse();

const options = program.opts();

(async () => {
  await htmlify({
    clean: options.clean ? true : false,
    continue: options.continue ? true : false,
    dropEmbedded: options.dropEmbedded ? true : false,
    dropIFrame: options.dropIframe ? true : false,
    dropImage: options.dropImage ? true : false,
    dropLearningTool: options.dropLearningTool ? true : false,
    dropVideo: options.dropVideo ? true : false,
    input: options.input,
    noPdf: options.noPdf ? true : false,
    outputHtml: options.outputHtml,
    outputPdf: options.outputPdf,
    split: options.split ? true : false,
  });
})();