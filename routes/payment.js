const express = require("express"); //!
const router = express.Router(); //!
const stripe = require("stripe")(process.env.SK_STRIPE);
const isAuthenticated = require("../middlewares/isAuthenticated"); //!

router.use(express.json());

//! A tester - je ne me souviens pas si elle est fonctionnelle

router.post("/payment", isAuthenticated, async (req, res) => {
  try {
    // Je reçois un token du front
    const stripeToken = req.body.stripeToken;
    const priceToPayInCents = req.body.amount * 100;
    // Je fais une requête à stripe pour créer un paiement
    const responseFromStripe = await stripe.charges.create({
      amount: priceToPayInCents,
      currency: "eur",
      description: req.body.title,
      source: stripeToken,
    });
    // Si le paiement est effectué, on met à jour l'offre et on renvoie au front le fait que tout s'est bien passé
    console.log(responseFromStripe);
    // Je renvoie au client le status de la réponse de stripe
    res.json(responseFromStripe.status);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
