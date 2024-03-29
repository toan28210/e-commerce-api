const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KEY)

router.post("/payment", (req, res) => {
     stripe.charges.create(
      {
        amount: req.body.amount,
        currency: 'usd',
        source: req.body.tokenId,
        description: 'My First Test Charge (created for API docs at https://www.stripe.com/docs/api)',
      },
      (stripeErr, stripeRes) => {
        if (stripeErr) {
          res.status(500).json(stripeErr);
        } else {
          res.status(200).json(stripeRes);
        }
      }
    );
  });


module.exports = router;