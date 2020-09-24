// -------------------------- Server Starting Code ---------------------------
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

// Mostrar el contenido de la varible de entorno "API_KEY"
console.log(process.env.API_KEY);

app.set('view engine', 'ejs');

// Utilizar body-parser para transmitir las solicitudes "pass our request"
app.use(bodyParser.urlencoded({
  extended: true
}));

// Utilizar la carpeta o directorio publico "public"
// Adonde guardamos codigos estaticos como HTML,CSS,JS,img,video,etc
app.use(express.static("public"));

// -------------------------- Activar MongoDB ---------------------------
const dbname = "userDB" // Nombre de la base de datos

// const url = `mongodb+srv://${username}:${password}@cluster0.quosx.mongodb.net/${dbname}`
const url = `mongodb://localhost:27017/${dbname}`

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('mongodb connected'))
  .catch(e => console.log('error de conexión', e))

  // ----------------------- PLANTILLAS MongoDB ------------------------------
  // Crear Schema NEW, plantilla con los datos a utilizar: title y content
  const userSchema = new mongoose.Schema({
    email: String,
    password: String
  });

  // Encriptar el passport, utilizando la variable de entorno "SECRET"
  userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: [`password`] });

  // Crear el NEW Modelo para la coleccion "users" pero en modo singular, sin la "s"
  // y con la primera letra en mayuscula "User"
  const User = new mongoose.model("User", userSchema);

// ------------------------ Activar paginas GET ------------------------------
// Acceder a las paginas WEB, utilizando GET:
app.get("/", function(req, res){
  res.render("home"); // Mostrar home.ejs
});

app.get("/login", function(req, res){
  res.render("login"); // Mostrar login.ejs
});

app.get("/register", function(req, res){
  res.render("register"); // Mostrar register.ejs
});
// ------------------------ Recibir informacion POST  ------------------------
// Utilizando la etiqueta "name" del HTML
// Recibir datos del register
app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.username, // Requerir la etiqueta name="userName", utilizando body-parser
    password: req.body.password // Requerir la etiqueta name="password", utilizando body-parser
  });

  newUser.save(function(err) {
    if (!err) {
      res.render("secrets");
    } else {
      console.log(err);
    }
  });

});
// Recibir y validar datos del login: email y password
app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if (err){
      console.log(err);
    } else {
      if (foundUser){
        if (foundUser.password === password){
          res.render("secrets");
        }
      }
    }
  });

});

// ------------------------- Install local SERVER ---------------------------
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
