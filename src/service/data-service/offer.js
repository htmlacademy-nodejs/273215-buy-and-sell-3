'use strict';
const logger = require(`../lib/logger`);
const {dateFormat} = require(`../../utils`);
const paginate = require(`../lib/paginator`);

const {Op} = require(`sequelize`);
const {
  Category,
  Comment,
  Offer,
  OffersType,
  Picture,
  User,
} = require(`../models`);


const offerOptions = {
  include: [
    {
      model: User,
      as: `user`,
      required: true,
    },
    {
      model: OffersType,
      as: `offer_type`,
      required: true,
      raw: true,
    },
    {
      model: Comment,
      as: `comments`
    },
    {
      model: Picture,
      as: `picture`
    }]
};

class OfferService {

  async create(offer) {
    try {
      const picture = await createPicture({
        /* с веба приходит только строка с именем файла */
        image: offer.picture,
        image2x: ``,
        background: `2`,
      });
      const type = await getType(offer.type);
      const newOffer = await Offer.create({
        title: offer.title,
        description: offer.description,
        type: type.id,
        sum: offer.sum,
        createDate: dateFormat(new Date(), `%Y-%m-%d`),
        updated: dateFormat(new Date(), `%Y-%m-%d`),
        pictureId: picture.id,
        userId: 1, /* todo пока нет авторизации пользователя */
      });

      const categories = await Category.findAll({
        where: {
          name: {
            [Op.in]: offer.category
          }
        }
      });
      await newOffer.addCategories(categories);
      return newOffer.toJSON();

    } catch (error) {
      logger.error(`Error when creating offer ${error}`);
      return {};
    }
  }

  async drop(id) {
    const deletedOffersCount = await Offer.destroy({
      where: {id}
    });

    return !!deletedOffersCount;
  }

  async findAll(options) {
    const {page, limit, ...otherOptions} = options;
    const {data: offers, ...result} = await paginate(Offer, {...offerOptions, ...otherOptions}, page, limit);
    if (!offers) {
      return [];
    }

    const list = await Promise.all(offers.map(async (offer) => {
      const category = await getCategoriesList(offer);
      return {
        ...offer.toJSON(),
        category,
      };
    }));

    return {
      ...result,
      offers: list,
    };
  }

  async findOne(id) {
    const offer = await Offer.findByPk(id, offerOptions);
    const category = await getCategoriesList(offer);
    return {
      ...offer.toJSON(),
      category,
    };
  }

  async update(id, offer) {
    try {
      const updateOffer = await Offer.findByPk(id, {raw: true});
      const currentPicture = await Offer.findByPk(updateOffer.pictureId, {raw: true});
      const isSamePicture = Object.entries(offer.picture).every((key, value) => value === currentPicture[key]);

      if (!isSamePicture) {
        /* загрузили новую картинку */
        updateOffer.pictureId = await createPicture(offer.picture);
      }

      updateOffer.type = await getType(offer.type);

      updateOffer.title = offer.title;
      updateOffer.description = offer.description;
      updateOffer.sum = offer.sum;
      updateOffer.updated = dateFormat(new Date(), `%Y-%m-%d %H:%M:%S`);

      return await updateOffer.save();
    } catch (error) {
      logger.error(`Error when creating offer ${error}`);
      return {};
    }
  }
}

async function createPicture(picture) {
  const newObject = await Picture.create({
    image: picture.image,
    image2x: picture.image2x,
    background: picture.background,
  }, {raw: true});
  return newObject.toJSON();
}

async function getType(name) {
  const typeObject = await OffersType.findOne({
    raw: true,
    where: {
      name
    }
  });
  return typeObject;
}

async function getCategoriesList(offer) {
  try {
    const categories = await offer.getCategories({raw: true});
    return categories.reduce((categoryList, category) => {
      categoryList.push(category.name);
      return categoryList;
    }, []);
  } catch (error) {
    logger.error(`Error when creating offer ${error}`);
    return {};
  }
}

module.exports = OfferService;
