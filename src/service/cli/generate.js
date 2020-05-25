'use strict';

const {nanoid} = require(`nanoid`);

const {
  getRandomInt,
  shuffle,
} = require(`../../utils`);

const chalk = require(`chalk`);
// Подключаем модуль `fs`
const fs = require(`fs`).promises;

const {
  MAX_ID_LENGTH,
  MAX_COMMENTS,
} = require(`../../constants`);

const DEFAULT_COUNT = 1;
const COUNT_MAX = 1000;
const FILE_NAME = `mocks.json`;

const OfferType = {
  offer: `offer`,
  sale: `sale`,
};

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const SumRestrict = {
  min: 1000,
  max: 100000,
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments)
    .slice(0, getRandomInt(1, 3))
    .join(` `),
  }))
);

const generateOffers = (count, titles, categories, sentences, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    category: [categories[getRandomInt(0, categories.length - 1)]],
    description: shuffle(sentences).slice(1, 5).join(` `),
    /* picture: getPictureFileName(getRandomInt(PictureRestrict.min, PictureRestrict.max)), */
    title: titles[getRandomInt(0, titles.length - 1)],
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
    type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    sum: getRandomInt(SumRestrict.min, SumRestrict.max),
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    // Считываем контент из файлов
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    if (countOffer > COUNT_MAX) {
      console.error(chalk.red(`Не больше ${COUNT_MAX} объявлений`));
      return true;
    }
    const content = JSON.stringify(generateOffers(countOffer, titles, categories, sentences, comments));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
    return true;
  }
};

