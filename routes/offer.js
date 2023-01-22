const express = require("express"); //!
const router = express.Router(); //!
const fileUpload = require("express-fileupload"); //! le package express-fileupload me permet de récupérer un body form-data
const convertToBase64 = require("../utils/convertToBase64");
const cloudinary = require("cloudinary").v2; //!
const Offer = require("../models/Offer"); //!
const isAuthenticated = require("../middlewares/isAuthenticated"); //!

//! ROUTE#1 Je crée une route publish en POST pour publier une annonce :
//* Contraintes :
//* -> authentifier mon utilisateur avant toute chose (appeler middleware isAuthenticated dans router.post) grâce à son token
//* -> recevoir les informations de mon offre (newOffer = new Offer({}))
//* -> parmi les infos : une image à uploader dans cloudinary
//TODO -> stocker mon offre dans MongoDb    await newOffer.save() en pensant bien à mettre l'urlsecure de mon image (ou tout l'objet))
// -> renvoyer au client un objet de plein d'infos, //TODO dont .populate("owner")

router.post(
  "/offer/publish",
  isAuthenticated,
  fileUpload(),
  async (req, res) => {
    // fileUpload() : Premier middleware qui sera appliqué, dans cette route, avant la fonction.
    try {
      const { title, description, price, condition, city, brand, size, color } =
        req.body;

      //* Pour uploader une image

      const picture = req.files.picture; // je récupère mon image picture depuis body form-data
      const pictureToUpload = convertToBase64(picture); // je convertis le buffer de ma picture en base64 grâce à ma fonction convertToBase64(file)
      const resultPicture = await cloudinary.uploader.upload(pictureToUpload); //j'utilise l'uploader de cloudinary pour upload ma picture qui est désormais prête

      //* Pour créer ma nouvelle offer

      const newOffer = new Offer({
        product_name: title,
        product_description: description,
        product_price: price,
        product_details: [
          { MARQUE: brand },
          { TAILLE: size },
          { ÉTAT: condition },
          { COULEUR: color },
          { EMPLACEMENT: city },
        ],
        product_image: resultPicture,
        // owner:req.user._id
        owner: req.user, //* avec mongoose, en requêtant toutes les infos de mon user, je stocke QUE L'ID dans Mongo
      });
      await newOffer.populate("owner");
      await newOffer.save();
      res.json(newOffer);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

//! ROUTE#2 Je crée une route offers en GET avec du query pour récupérer des annonces en fonction de crtières de recherche et de tri
//* Contraintes :
//* Récupérer un tableau d'annonces et le nombre d'annonces
//* Prévoir des filtres possibles en fonction de req query

router.get("/offers", async (req, res) => {
  try {
    // title=pull&priceMax=200&priceMin=20&sort=price-asc&page=3

    // On destructure les valeurs en query
    const { title, page, priceMax, priceMin, sort } = req.query;
    //* ON S'OCCUPE DES FILTRES
    //*Ci-dessous, on crée une variable filters {} qui sera ensuite utilisé dans find(),et qui va accueillir les infos en fonction de l'existence de ces infos (càd product name, priceMin, priceMax). L'utilité de cette variable filter est d'agrémenter un objet avec des infos quand elles sont données dans le query, et de ne pas être bloqué en cas de zéro info puisque filters resterait un objet vide
    const filters = {};
    if (title) {
      filters.product_name = new RegExp(title, "i"); // ici on crée la clé product_name de filter à laquelle on attribue un regExp basé sur le title du query
    }

    if (priceMin) {
      filters.product_price = { $gte: Number(priceMin) }; // ici on crée la clé prix qui prendra en objet un prix mini s'il existe, transformé en number
    }
    if (priceMax) {
      if (filters.product_price) {
        // si prixMAx renseigné, on vérifie si la clé product price existe déjà suite à la condition vérifiée if(priceMin){}
        filters.product_price.$lte = Number(priceMax); // si oui, on crée la "sous-clé" $lte et on y met le nombre prceMax
      } else {
        filters.product_price = { $lte: Number(priceMax) }; // sinon, on crée une clé product price dans lequel on met un nouvel objet qui aura pour clé $lte
      }
    }

    //* ON S'OCCUPE MAINTENANT DU TRI
    const sortedMethod = {}; // Je crée un objet vide pour recevoir les infos de tri

    if (sort) {
      // si le query renvoie sort=price-asc, alors je crée une clé method qui renverra en valeur "asc" (ou "desc" selon le query)
      sortedMethod.method = sort.replace("price-", "");
    }

    //* ON S'OCCUPE ENSUITE DES PAGES (nombre d'offres par page, skip, numéro)
    const limit = 2;
    let pageRequired = 1;
    if (page) pageRequired = Number(page); // on vérifie si on a une page en query, et auquel cas on transforme son numéro en nombre

    const skipped = limit * (pageRequired - 1);

    //* ENFIN, ON CHAINE TOUTES NOS METHODES FITLRES ET TRI
    const resultFiltersSorted = await Offer.find(filters)
      .sort(sortedMethod)
      .skip(skipped)
      .limit(limit)
      .populate("owner", "account")
      .select("product_name product_price");

    //* ET ON CREE UNE VARIABLE POUR CALCULER LE NOMBRE TOTAL D'OFFRES QUI REPONDENT A NOS CRITERES DE RECHERCHE
    const numberOfOffers = await Offer.countDocuments(filters);

    const response = {
      numberOfOffers: numberOfOffers,
      offers: resultFiltersSorted,
    };
    res.json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; //! pour exporter mes routes
