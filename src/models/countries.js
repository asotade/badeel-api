const mongoose = require('mongoose');

const countriesSchema = new mongoose.Schema(
  {
    name: String,
    code: String,
    flag: String,
  },
);

const Products = mongoose.model('Country', countriesSchema);

module.exports = Products;
