const express = require("express");
const router = express.Router();

const Favorite = require("../models/Favorite");
const User = require("../models/User");

//! Pas encore fonctionnel, à retravailler

//* Route pour créer un favori avec ses infos + le token de rattachement

router.post("/favorites/:userId", async (req, res) => {
  // Je destructure les infos venant du client
  const { token, product_name, offerId } = req.body;
  try {
    const newFavorite = new Favorite({
      token: token,
      product_name: product_name,
      offer_id: offerId,
    });
    await newFavorite.save();
    res.status(200).json({
      _id: newFavorite._id,
      token: newFavorite.token,
      product_name: newFavorite.product_name,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

//* Route pour récupérer les favoris rattachés à un user identifié par son token

router.get("/favorites/:userId", async (req, res) => {
  const token = req.params.userId;
  try {
    const favorite = await Favorite.find({ token: token });
    res.json(favorite);
    console.log(favorite);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
