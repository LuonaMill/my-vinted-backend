const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: { type: String, required: true },
  account: {
    username: String, //? voir si je peux mettre par défaut l'adresse mail avec default : User.email
    //TODO avatar: {type:Object, default:"none"} // nous verrons plus tard comment uploader une image
  },
  newsletter: Boolean,
  token: String,
  hash: String,
  salt: String,
});

module.exports = User;
