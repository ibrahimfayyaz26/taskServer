const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const file_type = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": ".png",
};

const storage = multer.diskStorage({
  destination: (req, file, cd) => {
    const fileT = file_type[file.mimetype];
    let err = new Error("wrong image type");
    if (fileT) {
      err = null;
    }
    cd(err, "upload");
  },
  filename: (req, file, cd) => {
    const fileT = file_type[file.mimetype];
    const fileName = `${file.originalname
      .split(" ")
      .join()}-${Date.now()}.${fileT}`;
    cd(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/", (req, res) => {
  User.find()
    .then((data) => {
      if (data.length) {
        res.send(data);
      } else {
        res.send("no data found");
      }
    })
    .catch((err) => res.send({ msg: err, failed: true }));
});

router.get("/:id", (req, res) => {
  User.findById(req.params.id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.send("no data found");
      }
    })
    .catch((err) => res.send({ msg: err, failed: true }));
});

router.post("/login", async (req, res) => {
  const secret = process.env.SECRET;
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.send({ msg: "wrong email address", failed: true });
  }
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "1w" });
    res.send({ user, token, failed: false });
  } else {
    res.send({ msg: "wrong password", failed: true });
  }
});

router.post("/register", upload.single("image"), async (req, res) => {
  const fileName = req.file.filename;

  const image = `${req.protocol}://${req.get("host")}/upload/${fileName}`;
  

  const secret = process.env.SECRET;
  const user = await User.findOne({ email: req.body.email });
  if (user == null) {
    const item = new User({
      email: req.body.email,
      image: image,
      password: bcrypt.hashSync(req.body.password, 10),
      name: req.body.name,
      lastName: req.body.lastName,
      country: req.body.country,
      city: req.body.city,
      phone: req.body.phone,
      language: req.body.language,
      industry: req.body.industry,
      facebookLink: req.body.facebookLink,
    });
    console.log("User");
    item
      .save()
      .then((data) => {
        if (data) {
          const token = jwt.sign({ userId: data.id }, secret, {
            expiresIn: "1w",
          });
          res.send({ user: data, token });
        } else {
          res.send("no data found");
        }
      })
      .catch((err) => res.send({ msg: err, failed: true }));
  } else {
    res.send({
      msg: "user with this email address already registered",
      failed: true,
    });
  }
});

module.exports = router;
