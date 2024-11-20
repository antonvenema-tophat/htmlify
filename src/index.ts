import { htmlify } from "./htmlify";
import { program } from "commander";

program
  .name("htmlify")
  
  .requiredOption("--cip <CIP>", "Content Item Pack ID.")
  .requiredOption("--discipline <DISCIPLINE>", "Course discipline.")
  .requiredOption("--token <TOKEN>", "Authorization bearer token for the Content Service API.")

  .option("--output <PATH>", "Output path.", "./output")

  .option("--continue", "Resume from a failed operation. (Skips regeneration of existing output files.)")
  .option("--split", "Split the course content into multiple output files (one per page).")

  .option("--no-aws-metadata", "Skips AWS metadata generation.")
  .option("--no-cache", "Ignores cached CIPs.")
  .option("--no-gcp-metadata", "Skips GCP metadata generation.")
  .option("--no-pdf", "Skips PDF generation.")
  
  .option("--drop-embedded", "Drops EMBEDDED content while converting.")
  .option("--drop-iframe", "Drops IFRAME content while converting.")
  .option("--drop-image", "Drops IMAGE content while converting.")
  .option("--drop-learning-tool", "Drops LEARNING_TOOL content while converting.")
  .option("--drop-video", "Drops VIDEO content while converting.")
  .option("--text-only", "Drop everything except text content while converting.")
  .description("CLI to convert course content from a JSON export to HTML.");

program.parse();

const options = program.opts();

(async () => {
  await htmlify({
    awsMetadata: options.awsMetadata ? true : false,
    cache: options.cache ? true : false,
    cip: options.cip,
    continue: options.continue ? true : false,
    discipline: options.discipline,
    dropEmbedded: options.textOnly || options.dropEmbedded ? true : false,
    dropIFrame: options.textOnly || options.dropIframe ? true : false,
    dropImage: options.textOnly || options.dropImage ? true : false,
    dropLearningTool: options.textOnly || options.dropLearningTool ? true : false,
    dropVideo: options.textOnly || options.dropVideo ? true : false,
    gcpMetadata: options.gcpMetadata ? true : false,
    output: options.output,
    pdf: options.pdf ? true : false,
    split: options.split ? true : false,
    token: options.token,
  });
})();