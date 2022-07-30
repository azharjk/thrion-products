"use strict";

/**
 *  order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", () => ({
  async create(ctx) {
    ctx.query = { populate: "product" };

    const { data: unformattedData } = await super.create(ctx);

    return {
      data: {
        id: unformattedData.id,
        name: unformattedData.attributes.name,
        product: {
          name: unformattedData.attributes.product.data.attributes.name,
          price: unformattedData.attributes.product.data.attributes.price,
        },
      },
    };
  },
}));
