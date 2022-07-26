module.exports = {
  routes: [
    {
      method: "POST",
      path: "/xendit-ewallet-callback",
      handler: "xendit-ewallet-callback.callbackAction",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
