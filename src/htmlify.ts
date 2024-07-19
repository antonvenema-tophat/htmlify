import chalk from "chalk";
import fs from "fs";
import path from "path";

const processQuestion = (data: any, depth: number): string => {
  const indent0 = "  ".repeat(depth);
  const indent1 = "  ".repeat(depth + 1);
  const indent2 = "  ".repeat(depth + 2);
  const indent3 = "  ".repeat(depth + 3);
  const indent4 = "  ".repeat(depth + 4);
  const indent5 = "  ".repeat(depth + 5);
  let html = `${indent0}<div class="question">\n`;
  html += `${indent1}<span class="heading">Question:</span>\n`;
  html += `${indent1}<span class="text">${data.question}</span>\n`;
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
      html += `${indent2}</div>\n`;
    }
  }
  html += `${indent1}</div>\n`;
  html += `${indent0}</div>\n`;
  return html;
}

const toHtml = (document: any, depth: number): string => {
  const indent0 = "  ".repeat(depth);
  const indent1 = "  ".repeat(depth + 1);
  const indent2 = "  ".repeat(depth + 2);
  let html = `${indent0}<div>\n`;
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