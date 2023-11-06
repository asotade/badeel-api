const { Countries } = require('../../models');
const { fetchCountries } = require('../../utils/helper');

const findAll = async (filter = {}) => {
  try {
    let result = await Countries.find(filter);
    if (result.length > 0) return { code: 0, result };

    const countries = await fetchCountries();
    result = await Countries.create(countries);
    return { code: 0, result };
  } catch (err) {
    console.log({ err });
    return { code: -1, result: err.message };
  }
};

module.exports = {
  findAll,
};
