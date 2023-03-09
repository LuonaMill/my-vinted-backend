const express = require("express");
const router = express.Router();

const Favorite = require("../models/Favorite");
const User = require("../models/User");

//! Pas encore fonctionnel, à retravailler

//* Route pour créer un favori avec ses infos + le token de rattachement

router.put("/favorites/:userId", async (req, res) => {
  const { offerId, userId } = req.body;
  try {
    const addFavoriteToUser = await User.findByIdAndUpdate(
      userId,
      { $push: { favorites: offerId } },
      { new: true }
    );
    if (addFavoriteToUser) {
      res
        .status(200)
        .json({ message: `${offerId} has been added to your favs` });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

//* Route pour récupérer les favoris rattachés à un user identifié par son token
//! Je pense que cette route sera inutile car je pourrai récup les infos directement via la route /user/:userId

router.get("/favorites/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("favorites");
    const userFavs = user.favorites;
    res.json(userFavs); // l'objectif
    console.log(userFavs);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
