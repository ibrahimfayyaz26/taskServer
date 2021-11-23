const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");

const app = express();

//helpers
const auth = require("./helpers/auth");

//Routers
const User = require("./Routes/User");
const Payment = require("./Routes/Payment");

// ENV Variables
const admin = process.env.ADMIN;
const password = process.env.DBPASSWORD;
const dbName = process.env.DBNAME;

// Middleware
app.use(express.json());
app.use(cors());
app.use("*", cors());
app.use(auth());
app.use("/upload", express.static(__dirname + "/upload"));

//Routers Use
app.use("/User", User);
app.use("/Payment", Payment);

// Main Api
app.get("/", (req, res) => {
  res.send("Task server");
});

// DataBase connection
mongoose
  .connect(
    `mongodb+srv://${admin}:${password}@cluster0.dgz9l.mongodb.net/${dbName}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("working");
  });

  var server = app.listen(process.env.PORT || 3000, () => {
    var port = server.address().port;
    console.log(`server on port ${port}`);
  });

/*
  {
      "email":"ibrahimfayyaz26@gmail.com",
      "password":"hello123",
      "name":"ibrahim" ,
      "lastName":"fayyaz" ,
      "country": "Pakistan",
      "city": "Sialkot",
      "phone": "03001799166",
      "language": "Urdu",
      "industry":"Science" ,
      "facebookLink":"https://facebook.com"
    
}
  */
