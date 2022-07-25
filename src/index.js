"use strict";

const Xendit = require("xendit-node");

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    const graphqlExtension = strapi.plugin("graphql").service("extension");

    const extension = ({ nexus }) => ({
      typeDefs: `
        type Actions {
          desktop_web_checkout_url: String
          mobile_web_checkout_url: String
          mobile_deeplink_checkout_url: String
          qr_checkout_string: String
        }

        type ChannelPropertiesEWalletCharge {
          success_redirect_url: String
        }

        type EWalletCharge {
          id: String
          business_id: String
          reference_id: String
          status: String
          currency: String
          charge_amount: Int
          capture_amount: Int
          refunded_amount: String
          checkout_method: String
          channel_code: String
          is_redirect_required: Boolean
          callback_url: String
          created: String
          updated: String
          void_status: String
          voided_at: String
          capture_now: Boolean
          customer_id: String
          payment_method_id: String
          failure_code: String
          basket: String
          metadata: String
          actions: Actions
          channel_properties: ChannelPropertiesEWalletCharge
        }

        input ChannelPropertiesInput {
          successRedirectURL: String
        }

        input CreateEWalletChargeInput {
          referenceID: String
          currency: String
          amount: Float
          checkoutMethod: String
          channelCode: String
          channelProperties: ChannelPropertiesInput
        }

        extend type Mutation {
          createEWalletCharge(data: CreateEWalletChargeInput!): EWalletCharge
        }
      `,
      resolvers: {
        Mutation: {
          createEWalletCharge: {
            async resolve(_, { data }) {
              // FIXME: Convert to strapi service
              const xendit = new Xendit({
                secretKey: process.env["XENDIT_TOKEN"]
              });

              const eWallet = new xendit.EWallet();

              try {
                const response = await eWallet.createEWalletCharge({
                  referenceID: data.referenceID,
                  currency: data.currency,
                  amount: data.amount,
                  checkoutMethod: data.checkoutMethod,
                  channelCode: data.channelCode,
                  channelProperties: {
                    successRedirectURL: data.channelProperties.successRedirectURL
                  }
                });

                return response;
              } catch (err) {
                // FIXME: Return some graphql exception
                console.error("[ERROR(EWalletCharge--Resolve)]: the error --");
                console.error(err);
              }

              // FIXME: Should not reached here
              console.assert(false);
              return null;
            }
          }
        }
      },
      resolversConfig: {
        "Mutation.createEWalletCharge": {
          auth: false // FIXME: For development purpose
        }
      }
    });

    graphqlExtension.use(extension);
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) { },
};
