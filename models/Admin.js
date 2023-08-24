const mongoose = require("mongoose");
const adminschema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
    is_Verified: {
      type: String,
      default: "Pending",
    },
    comment: {
      type: String,
    },
    password: {
      type: String,
      require: true,
    },
    image: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

const adminmodel = mongoose.model("admin", adminschema);
module.exports = adminmodel;
