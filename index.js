//! INDISPENSABLES
//? Vérifier si indispensables

const express = require("express"); //!
const mongoose = require("mongoose"); //!

const fileUpload = require("express-fileupload"); //?

const app = express(); //!
app.use(express.json()); //!

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost/vinted"); //!

//! Cloudinary : import, config, conversion buffer
//* 1) Je l'importe
const cloudinary = require("cloudinary").v2; //!
//* 2) le configure avec mes infos
cloudinary.config({
  cloud_name: "dtar5vtpq",
  api_key: "239371567395118",
  api_secret: "pFha8cc_t1Bogv56UbQLwfH1fnA",
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

app.listen(3002, () => {
  console.log("Server has started 🚀 ");
});
