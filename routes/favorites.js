const express = require("express");
const router = express.Router();

const Favorite = require("../models/Favorite");
const User = require("../models/User");

//! Route pour récupérer les favoris rattachés à un user identifié par son token

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

//! Route pour créer un favori avec ses infos + le token de rattachement

router.put("/favorites/:userId", async (req, res) => {
  const { offerId, userId } = req.body;
  try {
    const addFavoriteToUser = await User.findByIdAndUpdate(
      userId,
      { $push: { favorites: offerId } },
      { new: true }
    );
    if (addFavoriteToUser) {
      res.status(200).json(addFavoriteToUser);
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

//! Route pour supprimer les favoris rattachés à un user identifié par son token

router.delete("/favorites/:userId", async (req, res) => {
  const { offerId, userId } = req.body;
  try {
    const deleteFavoriteFromUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { favorites: offerId } },
      { new: true }
    );
    if (deleteFavoriteFromUser) {
      res.status(200).json(deleteFavoriteFromUser);
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
