//! Indispensables

const express = require("express"); //!
const uid2 = require("uid2"); //!
const SHA256 = require("crypto-js/sha256"); //!
const encBase64 = require("crypto-js/enc-base64"); //!
const router = express.Router(); //!
const fileUpload = require("express-fileupload");
const convertToBase64 = require("../utils/convertToBase64");
const cloudinary = require("cloudinary").v2; //!

//! J'importe mes modèles User et Offer
const User = require("../models/User"); //!
const Offer = require("../models/Offer");

//! ROUTE #1 Je crée une route signup en POST pour :
// -> recevoir les informations de mon user depuis ma requête en body
// -> condition #1 : vérifier que tous mes champs sont renseignés
// -> condition #2 : vérifier que l'email reçu n'appartient pas déjà à un autre compte utilisateur
// -> si conditions 1&2 sont vérifiées, lui créer un mot de passe crypté avec hash et salt
//TODO : importer un avatar que je stocke dans cloudinary puis ses infos dans mongodb
// -> sauvegarder le user dans ma base uniquement avec les bonnes infos (email, account.username, salt, hash et token)
// -> renvoyer les bonnes infos au client (différentes de celles sauvegardées en base)

router.post("/user/signup", fileUpload(), async (req, res) => {
  const { username, email, password, newsletter } = req.body; // je destructure les infos de mon body
  try {
    //* Je veux vérifier que tous mes champs sont renseignés avant d'aller + loin :
    if (!username || !email || !password || typeof newsletter !== "boolean") {
      return res.status(400).json({ message: "missing parameter" });
    }

    //* Je veux renvoyer une erreur si l'email existe déjà dans la bdd
    // je dois faire une recherche findOne
    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
      return res.status(409).json({
        //409 correspond aux erreurs "conflict"
        message: "There is already an account linked to this email",
      });
    }

    //* Si mes 2 conditions ont été vérifiées, je crée mon hash

    const userPassword = password;
    const salt = uid2(16);
    const hash = SHA256(salt + password).toString(encBase64);
    const token = uid2(64);
    //TODO: et je crée aussi mon avatar
    // const avatar = req.files.avatar;
    // const avatarToUpload = convertToBase64(avatar);
    // const avatarResult = cloudinary.uploader.upload(avatarToUpload);

    //* puis je créé mon nouveau user avec les infos que je souhaite sauvegarder SANS PASSWORD
    const newUser = new User({
      account: { username: username },
      email: email,
      newsletter: newsletter,
      salt: salt,
      hash: hash,
      token: token,
      //TODO avatar: { avatar: avatarResult },
    });

    //* je le sauvegarde en base
    await newUser.save();

    //* et je ne renvoie que les infos attendues dans la consigne
    res.json({
      _id: newUser._id,
      token: newUser.token,
      account: newUser.account,
      // avatar: newUser.avatarResult,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//! ROUTE #2 Je crée une route login en POST pour :
// -> pour se connecter, mon client envoie en body un email et un password
// -> condition#1 : vérifier que je n'ai pas déjà un user associé à l'adresse mail renseigné
// -> condition#2 : vérifier le mot de passe de mon user
// -> si conditions 1&2 sont vérifiées

router.post("/user/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const alreadyUser = await User.findOne({ email: email });
    if (!alreadyUser) {
      return res.json({
        message: "Unauthorized",
      });
    }
    // console.log(existingEmail);
    const newHash = SHA256(alreadyUser.salt + password).toString(encBase64);

    if (alreadyUser.hash === newHash) {
      console.log("right password");
      res.json({
        _id: alreadyUser._id,
        token: alreadyUser.token,
        account: alreadyUser.account,
      });
    } else {
      res.json({ message: "Unauthorized" });
      console.log("wrong password");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//! ROUTE #3 Je crée une route user/:userId en GET pour
// 1) récupérer les infos de mon user
// 2) récupérer le nombre d'annonces associé à son id

router.get("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const userInfos = await User.findById(userId).populate("offers");
    const offersCounter = await Offer.countDocuments({
      owner: { _id: userId },
    });

    res.status(200).json({ counter: offersCounter, user: userInfos });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//! J'indique que mes routes sont exportables
module.exports = router; //!

//? Questions
// Pourquoi mon avatar ne se save pas dans le user Mongodb ?
// Comment gérer un body raw et un body form-data en même temps ?
// Problème rencontré : ça me renvoie "missing parameter"
