import chalk from "chalk";
import fs from "fs";
import path from "path";

const toHtml = (document: any, depth: number): string => {
  const indent0 = "  ".repeat(depth);
  const indent1 = "  ".repeat(depth + 1);
  let html = `${indent0}<div>\n`;
  if (document.data) {
    const data = JSON.parse(document.data);
    if (data.display_name) html += `${indent1}<h1>${data.display_name}</h1>\n`;
    if (data.content) html += `${indent1}<div>${data.content}</div>\n`;
  }
  if (document.children) {
    for (const child of document.children) {
      html += toHtml(child, depth + 1);
    }
  }
  html += `${indent0}</div>\n`;
  return html;
};

const htmlify = async (o: Options) => {
  const inputPath = path.join(__dirname, o.inputPath);
  const outputPath = path.join(__dirname, o.outputPath);

  console.log(chalk.green("Testing output directory..."));
  try { await fs.promises.mkdir(outputPath); } catch { }

  for (const inputFileName of await fs.promises.readdir(inputPath)) {
    if (!inputFileName.endsWith(".json")) continue;
    const outputFileName = inputFileName.replace(".json", ".html");

    console.log();
    console.log(chalk.green(`Reading ${inputFileName}...`));
    const inputFile = await fs.promises.readFile(path.join(inputPath, inputFileName), "utf-8");

    console.log(chalk.green(`Parsing ${inputFileName}...`));
    const inputObject = JSON.parse(inputFile);

    console.log(chalk.green(`Opening ${outputFileName}...`));
    const outputFile = await fs.promises.open(path.join(outputPath, outputFileName), "w");
    try {
      console.log(chalk.green(`Writing ${outputFileName}...`));
      await outputFile.write(toHtml(inputObject["learning_material_data"], 0));

      console.log(chalk.green(`Closing ${outputFileName}...`));
      await outputFile.close();
    } catch (error) {
      console.log(chalk.red(`Error: ${error}`));
      outputFile.close();

      console.log(chalk.red(`Deleting ${outputFileName}...`));
      await fs.promises.rm(path.join(outputPath, outputFileName));
    }
  }
};

export { htmlify };