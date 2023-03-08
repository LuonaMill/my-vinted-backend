const express = require("express");
const router = express.Router();

const Favorite = require("../models/Favorite");
const User = require("../models/User");

//! Pas encore fonctionnel, à retravailler

//* Route pour créer un favori avec ses infos + le token de rattachement

router.put("/favorites/:userId", async (req, res) => {
  const { offerId, userId } = req.body;
  try {
    const addFavoriteToUser = await User.findByIdAndUpdate(userId);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

//* Route pour récupérer les favoris rattachés à un user identifié par son token
//! Je pense que cette route sera inutile car je pourrai récup les infos directement via la route /user/:userId

router.get("/favorites/:userId", async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.userId });
    const userFavs = user.favorites;
    res.json(user.favorites); // l'objectif
    console.log(user.favorites);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
