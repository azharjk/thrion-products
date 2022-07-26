"use strict";

/**
 * A set of functions called "actions" for `xendit-ewallet-callback`
 */

module.exports = {
  callbackAction: async (ctx, _next) => {
    const callbackToken = ctx.headers["x-callback-token"];
    if (callbackToken !== process.env["XENDIT_CALLBACK_TOKEN"]) {
      ctx.send({
        type: "ForbiddenError",
        message: "Callback token not matched",
      }, 403);
      return;
    }

    // FIXME: Move the logic to service
    try {
      const id = ctx.request.body.data.id;
      const status = ctx.request.body.data.status;

      const orderDetail = await strapi.db.query("api::order-detail.order-detail").update({
        where: {
          xenditId: id,
        },
        data: {
          xenditStatus: status,
        },
      });

      if (!orderDetail) {
        ctx.send({
          type: "NotFound",
          message: `order-detail not found with id '${id}'`,
        }, 404);
        return;
      }

      // FIXME: Send email to admin inform that payment is updated

      ctx.send({
        message: "Success",
      }, 200);
      return;
    } catch (err) {
      ctx.body = err;
    }
  },
};
