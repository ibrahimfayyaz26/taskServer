const express = require("express");
const router = express.Router();
const payment = require("../models/Payment");
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
  payment
    .find()
    .then((data) => {
      if (data.length) {
        res.send(data);
      } else {
        res.send([]);
      }
    })
    .catch((err) => res.send({ msg: err, failed: true }));
});

router.post("/", upload.single("image"), async (req, res) => {
  const fileName = req.file.filename;

  const image = `${req.protocol}://${req.get("host")}/upload/${fileName}`;
  

  const item = new payment({
    image: image,
    businessName: req.body.businessName,
    businessWebsite: req.body.businessWebsite,
    cardNumber: req.body.cardNumber,
    user: req.body.user,
  });
  item
    .save()
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.send("no data found");
      }
    })
    .catch((err) => res.send({ msg: err, failed: true }));
});

module.exports = router;
