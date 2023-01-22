//! INDISPENSABLES
//? Vérifier si indispensables
const express = require("express"); //!
const mongoose = require("mongoose"); //!
require("dotenv").config();

const fileUpload = require("express-fileupload"); //?

const app = express(); //!
app.use(express.json()); //!

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URI); //!

//! Cloudinary : import, config, conversion buffer
//* 1) Je l'importe
const cloudinary = require("cloudinary").v2; //!
//* 2) le configure avec mes infos
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
}); //!
//* Info complémentaire : ça va fonctionner avec convertToBase64 que j'ai mis dans "./utils"

//! Import de mes routes
const userRoutes = require("./routes/user");
const offerRoutes = require("./routes/offer");

//! Exécution de mes routes
app.use(userRoutes);
app.use(offerRoutes);

app.all("*", (req, res) => {
  res.status(404).json({ message: "This route doesn't exist" });
});

app.listen(process.env.PORT, () => {
  console.log("Server has started 🚀 ");
});
