const mongoose = require("mongoose");
const live_url = 'mongodb+srv://som711verma:som711@cluster0.f6gopcr.mongodb.net/blogproject?retryWrites=true&w=majority'
const local_url = "mongodb://127.0.0.1:27017/blogproject";

const connectdb = () => {
  return mongoose.connect(live_url)

    .then(() => {
      console.log("Database connected....")
    })
    .catch((error) => {
      console.log(error)
    })
}
module.exports = connectdb;
