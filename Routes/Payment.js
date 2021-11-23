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

router.post("/", upload.array("images"), async (req, res) => {
  let Images = [];

  const fileName = req.files;

  if(fileName){
    fileName.map((fileT) =>
    Images.push(`${req.protocol}://${req.get("host")}/upload/${fileT.filename}`)
  );
  }

  const item = new payment({
    images: Images,
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
