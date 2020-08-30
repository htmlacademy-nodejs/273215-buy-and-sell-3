'use strict';

const {nanoid} = require(`nanoid`);
const {getLogger} = require(`../lib/logger`);

const {
  getRandomInt,
  shuffle,
  dateFormat,
  getRandomDate,
  printNumWithLead0,
  readContentFile,
} = require(`../../utils`);

const chalk = require(`chalk`);
// Подключаем модуль `fs`
const fs = require(`fs`).promises;

const {
  MAX_COMMENTS,
  PictureRestrict,
} = require(`../../constants`);

const logger = getLogger();
const DEFAULT_COUNT = 1;
const COUNT_MAX = 1000;
const FILE_NAME = `fill-db.sql`;

const OfferType = [
  {
    'id': `1`,
    'name': `offer`,
  },
  {
    'id': `2`,
    'name': `sale`,
  }
];

const usersList = [
  {
    'id': `1`,
    'email': `nov@mail.ru`,
    'password': `god`,
    'name': `Амфибрахий`,
    'surname': `Новиков`,
  },
  {
    'id': `2`,
    'email': `pet@ya.ru`,
    'password': `evil`,
    'name': `Владилен`,
    'surname': `Феликс`,
  }
];

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

const generateData = (count, titles, categories, sentences, comments, users) => {
  const offersCategories = [];
  const offersComments = [];
  const pictures = [];
  const offers = Array(count).fill({}).map((_, index) => {
    const offerId = index + 1;
    /* добавляем категории объявления */
    shuffle(categories).slice(1, getRandomInt(0, categories.length - 1)).forEach((_, index) => {
      offersCategories.push({
        'id': offersCategories.length + 1,
        'offer_id': offerId,
        'category_id': index + 1,
      });
    });
    /* генерируем картинки и сохраняем для формирования строк таблицы */
    const picturyId = pictures.push(Object.assign({'id': pictures.length + 1}, getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX))));

    const offerDate = getRandomDate();
    /* генерируем комментарии объявления */
    generateComments(getRandomInt(1, MAX_COMMENTS), comments).forEach((comment) => {
      offersComments.push({
        'id': offersComments.length + 1,
        'offer_id': offerId,
        'text': comment.text,
        'user_id': users[getRandomInt(0, users.length - 1)].id,
        'created': dateFormat(getRandomDate(offerDate), `%Y-%m-%d %H:%M:%S`),
      });
    });

    return {
      'id': offerId,
      'description': shuffle(sentences).slice(1, 5).join(` `),
      'picture_id': picturyId,
      'title': titles[getRandomInt(0, titles.length - 1)],
      'type': OfferType[Math.floor(Math.random() * Object.keys(OfferType).length)].id,
      'user_id': users[Math.floor(Math.random() * Object.keys(users).length)].id,
      'create_date': dateFormat(offerDate, `%Y-%m-%d %H:%M:%S`),
      'updated': dateFormat(offerDate, `%Y-%m-%d %H:%M:%S`),
      'sum': getRandomInt(SumRestrict.min, SumRestrict.max),
    };
  });

  return {
    offers,
    offersCategories,
    offersComments,
    pictures,
  };
};

const generateFillTableScript = (tableName, data) => {
  return `
insert into ${tableName}(${Object.keys(data[0]).join(`,`)}) values
${data.map((row) => `(${Object.values(row).map((v) => `'${v}'`).join(`,`)})`).join(`,`)};
 `;
};
module.exports = {
  name: `--fill`,
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
    const {
      offers,
      offersCategories,
      offersComments,
      pictures,
    } = generateData(countOffer, titles, categories, sentences, comments, usersList);

    const content = `
/* список пользователей */${generateFillTableScript(`users`, usersList)}
/* справочник категорий */${generateFillTableScript(`categories`, categories.map((name, id) => ({id: id + 1, name})))}
/* справочник типов объявлений */${generateFillTableScript(`offers_types`, OfferType)}
/* справочник картинок */${generateFillTableScript(`pictures`, pictures)}
/* список объявлений */${generateFillTableScript(`offers`, offers)}
/* категории объявлений */${generateFillTableScript(`offers_categories`, offersCategories)}
/* справочник категорий */${generateFillTableScript(`comments`, offersComments)}
    `;

    try {
      await fs.writeFile(FILE_NAME, content);
      logger.info(chalk.green(`Operation success. File created.`));
    } catch (err) {
      logger.error(chalk.red(`Can't write data to file...`));
    }
    return true;
  }
};

