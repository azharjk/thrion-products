"use strict";

/**
 *  display-product controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::display-product.display-product", () => ({
  async find(ctx) {
    ctx.query = { populate: { product: { populate: "images" } } };

    const { data } = await super.find(ctx);

    // FIXME: Convert this to a service
    const serializedData = {
      data: [],
    };

    data.forEach((d) => {
      const product = {
        id: d.attributes.product.data.id,
        name: d.attributes.product.data.attributes.name,
        price: d.attributes.product.data.attributes.price,
        condition: d.attributes.product.data.attributes.condition,
        size: d.attributes.product.data.attributes.size,
        minusInfo: d.attributes.product.data.attributes.minusInfo,
        thumbnailUrl: d.attributes.product.data.attributes.images.data[0].attributes.url,
        images: [],
      };

      d.attributes.product.data.attributes.images.data.forEach((image) => {
        product.images.push({
          url: image.attributes.url,
        });
      });

      serializedData.data.push(product);
    });

    return serializedData;
  },
}));
