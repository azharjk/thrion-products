"use strict";

/**
 *  product controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::product.product", () => ({
  // FIXME: There is unhandle resource not found
  //        when passing the `id` that not in the database
  async findOne(ctx) {
    ctx.query = { populate: "*" };

    const { data: unserializedData } = await super.findOne(ctx);

    const images = [];

    unserializedData.attributes.images.data.forEach((d) => {
      images.push({
        url: d.attributes.url,
      });
    });

    return {
      data: {
        id: unserializedData.id,
        name: unserializedData.attributes.name,
        price: unserializedData.attributes.price,
        condition: unserializedData.attributes.condition,
        size: unserializedData.attributes.size,
        minusInfo: unserializedData.attributes.minusInfo,
        thumbnailUrl: unserializedData.attributes.thumbnailUrl,
        images,
      },
    };
  },
}));
