// Ici je crée mon middleware pour vérifier l'authentificaiton de mon user via son token
const User = require("../models/User"); //!

const isAuthenticated = async (req, res, next) => {
  //!
  try {
    //* 1) Condition :si je ne reçois pas de token alors return Unauthorized
    if (!req.headers.authorization) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    //* 2a) Je crée une variable token qui reçoit strictement le token depuis postman
    const token = req.headers.authorization.replace("Bearer ", "");
    //* 2b) Je crée une variable user qui va récupérer le user associé à ce token
    const user = await User.findOne({
      token: token,
    }); //!

    //* 3) Condition : si je ne trouve pas de user associé au token alors return Unauthorized
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    //* 4) On crée une clé "user" dans req. pour que la route dans laquelle le middleware est appelé ait accès à req.user
    // en la stockant, je vais ainsi pouvoir récupérer user dans les routes où j'appelle isAuthenticated
    req.user = user;
    //* 5) J'ai tout vérifié, j'ai créé ma clé, donc je passe à la suite de ma fonction dans la route où le middleware est appelé
    next(); //!
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = isAuthenticated; //!
