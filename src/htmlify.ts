import chalk from "chalk";
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import sanitizeFilename from "sanitize-filename";

const processQuestion = (data: any, depth: number): string => {
  const indent0 = "  ".repeat(depth);
  const indent1 = "  ".repeat(depth + 1);
  const indent2 = "  ".repeat(depth + 2);
  const indent3 = "  ".repeat(depth + 3);
  const indent4 = "  ".repeat(depth + 4);
  const indent5 = "  ".repeat(depth + 5);
  let html = `${indent0}<div class="question-answer">\n`;
  html += `${indent1}<div class="question">\n`;
  html += `${indent2}<span class="heading">Question:</span>\n`;
  html += `${indent2}<span class="text">${data.question.replaceAll("\\_", "_")}</span>\n`;
  html += `${indent1}</div>\n`;
  html += `${indent1}<div class="answer">\n`;
  if (data.choices?.length) {
    html += `${indent2}<div class="choices">\n`;
    html += `${indent3}<span class="heading">Choices:</span>\n`;
    html += `${indent3}<ul>\n`;
    for (const choice of data.choices) {
      html += `${indent4}<li>${choice}</li>\n`;
    }
    html += `${indent3}</ul>\n`;
    html += `${indent2}</div>\n`;
  }
  if (data.correct_answers?.length) {
    html += `${indent2}<div class="correct-answers">\n`;
    html += `${indent3}<span class="heading">Correct Answers:</span>\n`;
    html += `${indent3}<ul>\n`;
    for (const correctAnswer of data.correct_answers) {
      html += `${indent4}<li>${correctAnswer}</li>\n`;
    }
    html += `${indent3}</ul>\n`;
    html += `${indent2}</div>\n`;
  }
  if (data.explanation_text) {
    html += `${indent2}<div class="explanation-text">\n`;
    html += `${indent3}<span class="heading">Explanation Text:</span>\n`;
    html += `${indent3}<span class="text">${data.explanation_text}</span>\n`;
    html += `${indent2}</div>\n`;
  }
  if (data.formula) {
    html += `${indent2}<div class="formula">\n`;
    html += `${indent3}<span class="heading">Formula:</span>\n`;
    html += `${indent3}<span class="text">${data.formula}</span>\n`;
    html += `${indent2}</div>\n`;
  }
  if (data.image_url) {
    html += `${indent2}<div class="image">\n`;
    html += `${indent3}<img src="${data.image_url}" />\n`;
    html += `${indent2}</div>\n`;
  }
  if (data.match_a?.length) {
    html += `${indent2}<div class="match-a">\n`;
    html += `${indent3}<span class="heading">Match A:</span>\n`;
    html += `${indent3}<ul>\n`;
    for (const match of data.match_a) {
      html += `${indent4}<li>${match}</li>\n`;
    }
    html += `${indent3}</ul>\n`;
    html += `${indent2}</div>\n`;
  }
  if (data.match_b?.length) {
    html += `${indent2}<div class="match-b">\n`;
    html += `${indent3}<span class="heading">Match B:</span>\n`;
    html += `${indent3}<ul>\n`;
    for (const match of data.match_b) {
      html += `${indent4}<li>${match}</li>\n`;
    }
    html += `${indent3}</ul>\n`;
    html += `${indent2}</div>\n`;
  }
  if (data.numeric_blanks) {
    for (const numeric_blank of data.numeric_blanks) {
      html += `${indent2}<div class="numeric-blank">\n`;
      html += `${indent3}<span class="heading">Numeric Blank (${numeric_blank.keyword}):</span>\n`;
      html += `${indent3}<span class="text">${numeric_blank.answer}</span>\n`;
      html += `${indent2}</div>\n`;
    }
  }
  if (data.sorted_options?.length) {
    html += `${indent2}<div class="sorted-options">\n`;
    html += `${indent3}<span class="heading">Sorted Options:</span>\n`;
    html += `${indent3}<ul>\n`;
    for (const sortedOption of data.sorted_options) {
      html += `${indent4}<li>${sortedOption}</li>\n`;
    }
    html += `${indent3}</ul>\n`;
    html += `${indent2}</div>\n`;
  }
  if (data.word_blanks) {
    html += `${indent2}<div class="word-blanks">\n`;
    for (const word_blank of data.word_blanks) {
      html += `${indent3}<div class="word-blank">\n`;
      html += `${indent4}<span class="heading">Word Blank (${word_blank.keyword}):</span>`;
      html += `${indent4}<ul>\n`;
      for (const correctAnswer of word_blank.correct_answers_list) {
        html += `${indent5}<li>${correctAnswer}</li>`;
      }
      html += `${indent4}</ul>\n`;
      html += `${indent3}</div>\n`;
    }
    html += `${indent2}</div>\n`;
  }
  html += `${indent1}</div>\n`;
  html += `${indent0}</div>\n`;
  return html;
}

const toHtml = (document: any, depth: number, o: Options): string => {
  if (document.type == "EMBEDDED" && o.dropEmbedded) return "";
  if (document.type == "IFRAME" && o.dropIFrame) return "";
  if (document.type == "IMAGE" && o.dropImage) return "";
  if (document.type == "LEARNING_TOOL" && o.dropLearningTool) return "";
  if (document.type == "VIDEO" && o.dropVideo) return "";
  const indent0 = "  ".repeat(depth);
  const indent1 = "  ".repeat(depth + 1);
  const indent2 = "  ".repeat(depth + 2);
  let html = "";
  if (depth == 0) {
    html += `<html>\n`;
    html += `<style type="text/css">\n`;
    html += `body {\n`;
    html += `  padding: 1em;\n`;
    html += `}\n`;
    html += `.question-answer {\n`;
    html += `  border: 1px solid black;\n`;
    html += `  padding: 1em;\n`;
    html += `}\n`;
    html += `.question {\n`;
    html += `  margin-bottom: 1em;\n`;
    html += `}\n`;
    html += `.question .heading {\n`;
    html += `  font-weight: bold;\n`;
    html += `}\n`;
    html += `.answer .heading {\n`;
    html += `  font-weight: bold;\n`;
    html += `}\n`;
    html += `</style>\n`;
    html += `<body>\n`;
  }
  html += `${indent0}<div>\n`;
  if (document.data != "{}") {
    const data = JSON.parse(document.data);
    if (data.display_name) {
      html += `${indent1}<h1 class="display-name">${data.display_name}</h1>\n`;
    }
    if (data.content) {
      html += `${indent1}<div class="content">\n`;
      html += `${indent2}${data.content}\n`;
      html += `${indent1}</div>\n`;
    }
    if (data.item_details) {
      if (data.item_details.content) {
        html += `${indent1}<div class="detail-content">\n`;
        html += `${indent2}${data.item_details.content}\n`;
        html += `${indent1}</div>\n`;
      } else if (data.item_details.question) {
        html += processQuestion(data.item_details, depth + 1);
      } else if (data.item_details.question_variants) {
        html += data.item_details.question_variants.map((x: any) => processQuestion(x, depth + 1)).join("");
      } else if (data.item_details.body) {
        html += `${indent1}<div class="detail-body">\n`;
        html += `${indent2}${data.item_details.body}\n`;
        html += `${indent1}</div>\n`;
      }
    }
  }
  if (document.children) {
    for (const child of document.children) {
      html += toHtml(child, depth + 1, o);
    }
  }
  html += `${indent0}</div>\n`;
  if (depth == 0) {
    html += `</body>\n`;
    html += `</html>\n`;
  }
  return html;
};

const toHtmls = (document: any, path: string, o: Options) => {
  if (document.type == "COURSE") {
    return (document.children as any[]).map((x: any): any[] => toHtmls(x, path, o)).flat();
  }

  const data = JSON.parse(document.data);
  if (document.type == "FOLDER") {
    return (document.children as any[]).map((x: any): any[] => toHtmls(x, `${path}${sanitizeFilename(data.display_name.trim())}/`, o)).flat();
  }

  if (document.type == "CONTAINER") {
    return [{
      path: `${path}${sanitizeFilename(data.display_name.trim())}.html`,
      html: toHtml(document, 0, o),
    }];
  }
  return [];
};

const htmlToPdf = async (inputFilePath: string, outputFilePath: string) => {
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    await page.goto(`file://${inputFilePath}`, {
      timeout: 0,
    });
    await page.pdf({
      displayHeaderFooter: false,
      path: outputFilePath,
      tagged: false,
      timeout: 0,
    });
  } finally {
    await browser.close();
  }
};

const htmlify = async (o: Options) => {
  const inputPath = path.join(__dirname, o.input);
  const outputPathHtml = path.join(__dirname, o.outputHtml);
  const outputPathPdf = path.join(__dirname, o.outputPdf);

  if (o.clean) {
    console.log(chalk.green("Cleaning output folders..."));
    for (const outputFileName of await fs.promises.readdir(outputPathHtml)) {
      await fs.promises.rm(path.join(outputPathHtml, outputFileName), { recursive: true });
    }
    for (const outputFileName of await fs.promises.readdir(outputPathPdf)) {
      await fs.promises.rm(path.join(outputPathPdf, outputFileName), { recursive: true });
    }
  }

  console.log();
  console.log(chalk.blue.bold("JSON --> HTML"));

  for (const inputFileName of await fs.promises.readdir(inputPath)) {
    if (!inputFileName.endsWith(".json")) continue;

    console.log();
    console.log(chalk.green.bold(inputFileName));
    console.log(chalk.green(`Reading...`));
    const inputFile = await fs.promises.readFile(path.join(inputPath, inputFileName), "utf-8");

    console.log(chalk.green(`Parsing...`));
    const document = JSON.parse(inputFile)["learning_material_data"];

    if (o.split) {
      console.log(chalk.green(`Generating HTML...`));
      const outputHtmls = toHtmls(document, "/", o);
      for (const outputHtml of outputHtmls) {
        const outputFileName = path.join(inputFileName.replace(".json", ""), outputHtml.path).replaceAll(path.sep, '-');
        const outputFilePathHtml = path.join(outputPathHtml, outputFileName);
        try { await fs.promises.mkdir(path.dirname(outputFilePathHtml), { recursive: true }); } catch { }
        const outputFileHtml = await fs.promises.open(outputFilePathHtml, "w");
        try {
          await outputFileHtml.write(outputHtml.html);
          await outputFileHtml.close();
          console.log(chalk.green.italic(outputFileName));
        } catch (error) {
          console.log(chalk.red(`Error: ${error}`));
          outputFileHtml.close();
          await fs.promises.rm(outputFilePathHtml);
          throw error;
        }
      }
    } else {
      const outputFileName = inputFileName.replace(".json", ".html");

      console.log(chalk.green(`Generating HTML...`));
      const outputHtml = toHtml(document, 0, o);
      const outputFilePathHtml = path.join(outputPathHtml, outputFileName);
      try { await fs.promises.mkdir(path.dirname(outputFilePathHtml), { recursive: true }); } catch { }
      const outputFileHtml = await fs.promises.open(outputFilePathHtml, "w");
      try {
        await outputFileHtml.write(outputHtml);
        await outputFileHtml.close();
        console.log(chalk.green.italic(outputFileName));
      } catch (error) {
        console.log(chalk.red(error));
        outputFileHtml.close();
        try { await fs.promises.rm(outputFilePathHtml); } catch { }
        throw error;
      }
    }
  }

  if (o.pdf) {
    console.log();
    console.log(chalk.blue.bold("HTML --> PDF"));

    for (const outputFileNameHtml of await fs.promises.readdir(outputPathHtml, { recursive: true, })) {
      if (!outputFileNameHtml.endsWith(".html")) continue;
      const outputFileNamePdf = outputFileNameHtml.replace(".html", ".pdf");

      console.log();
      console.log(chalk.green.bold(outputFileNameHtml));
      const outputFilePathPdf = path.join(outputPathPdf, outputFileNamePdf);
      if (o.continue && fs.existsSync(outputFilePathPdf)) {
        console.log(chalk.green(`Skipping PDF...`));
        console.log(chalk.green.italic(outputFileNamePdf));
        continue;
      }
      console.log(chalk.green(`Generating PDF...`));
      try { await fs.promises.mkdir(path.dirname(outputFilePathPdf), { recursive: true }); } catch { }
      try {
        await htmlToPdf(path.join(outputPathHtml, outputFileNameHtml), outputFilePathPdf);
        console.log(chalk.green.italic(outputFileNamePdf));
      } catch (error) {
        console.log(chalk.red(error));
        try { await fs.promises.rm(outputFilePathPdf); } catch { }
        throw error;
      }
    }
  }
};

export { htmlify };