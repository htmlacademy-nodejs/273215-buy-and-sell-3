'use strict';

const {nanoid} = require(`nanoid`);
const logger = require(`../lib/logger`);

const {
  getRandomInt,
  shuffle,
  printNumWithLead0,
  readContentFile,
} = require(`../../utils`);

const chalk = require(`chalk`);
// Подключаем модуль `fs`
const fs = require(`fs`).promises;

const {
  MAX_ID_LENGTH,
  MAX_COMMENTS,
  PictureRestrict,
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

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments)
    .slice(0, getRandomInt(1, 3))
    .join(` `),
  }))
);

const getPictureFileName = (number) => {
  const numWithLead0 = `${printNumWithLead0(number)}`;
  return {
    background: numWithLead0,
    image: `item${numWithLead0}.jpg`,
    image2x: `item${numWithLead0}@2x.jpg`
  };
};

const generateOffers = (count, titles, categories, sentences, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    category: shuffle(categories).slice(1, getRandomInt(0, categories.length - 1)),
    description: shuffle(sentences).slice(1, 5).join(` `),
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
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
    const sentences = await readContentFile(FILE_SENTENCES_PATH);
    const titles = await readContentFile(FILE_TITLES_PATH);
    const categories = await readContentFile(FILE_CATEGORIES_PATH);
    const comments = await readContentFile(FILE_COMMENTS_PATH);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    if (countOffer > COUNT_MAX) {
      logger.error(chalk.red(`Не больше ${COUNT_MAX} объявлений`));
      return true;
    }
    const content = JSON.stringify(generateOffers(countOffer, titles, categories, sentences, comments));

    try {
      await fs.writeFile(FILE_NAME, content);
      logger.info(chalk.green(`Operation success. File created.`));
    } catch (err) {
      logger.error(chalk.red(`Can't write data to file...`));
    }
    return true;
  }
};

