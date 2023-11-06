const mongoose = require('mongoose');
const { Products } = require('../../models');
const { isObjectId } = require('../../utils/helper');

const findAll = async (filter = {}) => {
  try {
    const result = await Products.find(filter).sort({ createdAt: -1 });
    return { code: 0, result };
  } catch (err) {
    console.log({ err });
    return { code: -1, result: err.message };
  }
};

const findByCountryAndProduct = async (product, country) => {
  const filter = {
    replacementFor: new mongoose.Types.ObjectId(product), countriesAvailable: country.toUpperCase(), excluded: false,
  };
  return findAll(filter);
};

const findOne = async (id) => {
  if (!isObjectId(id)) return { code: -1, result: 'Please provide a valid ID' };

  try {
    const result = await Products.findById(id);
    return { code: 0, result };
  } catch (err) {
    console.log({ err });
    return { code: -1, result: err.message };
  }
};

const createOne = async (data) => {
  let code = 0;
  let result = {};
  try {
    const { recommendations, ...product } = data;
    result = await Products.create(product);

    console.log({ result });
    if (recommendations && Array.isArray(recommendations)) {
      const { _id: replacementFor, category } = result;
      result.recommendations = await Promise.all(recommendations.map(async (p) => {
        const { _id: id } = p;
        if (id && isObjectId(id)) return id;
        const newProduct = await Products.create({ ...p, replacementFor, category });
        return newProduct._id;
      }));
      await result.save();
    }
  } catch (err) {
    console.log({ err });
    code = -1;
    result = err.message;
  }
  return { code, result };
};

const assignProduct = async (id, recommended) => {
  if (!isObjectId(id) || !isObjectId(recommended)) return { code: -1, result: 'Please provide a valid ID' };
  try {
    const { code, result: product } = await findOne(id);
    if (code) return { code, result: product };

    const recommendedProduct = await findOne(recommended);
    if (recommendedProduct.code) return recommendedProduct;

    product.recomendations.push(recommendedProduct._id);

    await product.save();
    return { code: 0, result: product };
  } catch (err) {
    console.log({ err });
    return { code: -1, result: err.message };
  }
};

const unassignProduct = async (id, recommended) => {
  if (!isObjectId(id) || !isObjectId(recommended)) return { code: -1, result: 'Please provide a valid ID' };
  try {
    const { code, result: product } = await findOne(id);
    if (code) return { code, result: product };

    const recommendedProduct = await findOne(recommended);
    if (recommendedProduct.code) return recommendedProduct;

    product.recomendations.pop(recommendedProduct._id);

    await product.save();
    return { code: 0, result: product };
  } catch (err) {
    console.log({ err });
    return { code: -1, result: err.message };
  }
};

module.exports = {
  findByCountryAndProduct,
  findAll,
  findOne,
  createOne,
  assignProduct,
  unassignProduct,
};
