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
  .option("--no-aws-metadata", "Skips AWS metadata generation.")
  .option("--no-gcp-metadata", "Skips GCP metadata generation.")
  .option("--no-pdf", "Skips PDF generation.")
  .option("--split", "Split the course content into multiple output files (one per page).")
  .option("--text-only", "Drop all non-text content while converting.")
  .description("CLI to convert course content from a JSON export to HTML.");

program.parse();

const options = program.opts();

(async () => {
  await htmlify({
    awsMetadata: options.awsMetadata ? true : false,
    clean: options.clean ? true : false,
    continue: options.continue ? true : false,
    dropEmbedded: options.textOnly || options.dropEmbedded ? true : false,
    dropIFrame: options.textOnly || options.dropIframe ? true : false,
    dropImage: options.textOnly || options.dropImage ? true : false,
    dropLearningTool: options.textOnly || options.dropLearningTool ? true : false,
    dropVideo: options.textOnly || options.dropVideo ? true : false,
    gcpMetadata: options.gcpMetadata ? true : false,
    input: options.input,
    outputHtml: options.outputHtml,
    outputPdf: options.outputPdf,
    pdf: options.pdf ? true : false,
    split: options.split ? true : false,
  });
})();