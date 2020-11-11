'use strict';

const {Category} = require(`../models`);

class CategoryService {
  async findAll() {
    const categories = await Category.findAll({raw: true});
    return categories.reduce((categoryList, category) => {
      categoryList.push(category.name);
      return categoryList;
    }, []);
  }
}

module.exports = CategoryService;
