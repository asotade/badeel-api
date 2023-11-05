const mongoose = require('mongoose');
const { CATEGORIES } = require('../utils/constants');

const productsSchema = new mongoose.Schema(
  {
    title: String,
    logo: String,
    country: String,
    category: {
      type: String,
      enum: CATEGORIES,
      required: true,
      default: CATEGORIES[0],

    },
    excluded: {
      type: Boolean,
      default: false,
    },
    countriesAvailable: {
      type: [String],
      default: [],
    },
    recommendations: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          autopopulate: true,
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

productsSchema.plugin(require('mongoose-autopopulate'));
const Products = mongoose.model('Product', productsSchema);

module.exports = Products;
