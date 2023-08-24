const AboutModel = require("../../models/About");
var cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dkktixgdd",
  api_key: "677659928374367",
  api_secret: "IwWks6xCMpol3ZkClkYxzwNH19s",
});
cloudinary.config({
  cloud_name: "dkktixgdd",
  api_key: "677659928374367",
  api_secret: "IwWks6xCMpol3ZkClkYxzwNH19s",
});
class AboutController {
  static displayabout = async (req, res) => {
    try {
      const { name, email, image, is_Verified } = req.admin;
      const data = await AboutModel.find();
      // console.log(data)
      res.render("admin/about/displayabout", { d: data, is_Verified: is_Verified });
    } catch (err) {
      console.log(err);
    }
  };

  static insertabout = async (req, res) => {
    // console.log(req.body)

    try {
      // const result = await CategoryModel.create(req.body)
      // console.log(result)
      // console.log(req.files.image)

      //upload image
      const file = req.files.image;
      const myimage = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "aboutimage",
      });

      const result = new AboutModel({
        description: req.body.description,
        image: {
          public_id: myimage.public_id,
          url: myimage.secure_url,
        },
      });
      await result.save();
      // console.log(result)
      res.redirect("/displayabout");
    } catch (err) {
      console.log(err);
    }
  };

  static editabout = async (req, res) => {
    try {
      const { name, email, image, is_Verified } = req.admin;
      const data = await AboutModel.findById(req.params.id);
      res.render("admin/about/editabout", { edit: data, is_Verified: is_Verified });
      // console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  static updateabout = async (req, res) => {
    try {
      if (req.files) {
        //code of deleting the image
        const about = await AboutModel.findById(req.params.id);
        const image_id = about.image.public_id;
        // console.log(image_id)
        await cloudinary.uploader.destroy(image_id);

        //inserting the image
        const file = req.files.image;
        //image upload code
        const myImage = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: "aboutimage",
        });

        var data = {
          description: req.body.description,
          image: {
            public_id: myImage.public_id,
            url: myImage.secure_url,
          },
        };
      } else {
        var data = {
          description: req.body.description,
        };
      }
      const id = req.params.id;
      await AboutModel.findByIdAndUpdate(id, data);
      res.redirect("/displayabout");
    } catch (err) {
      console.log(err);
    }
  };

  static viewabout = async (req, res) => {
    // console.log(req.params.id)
    try {
      const { name, email, image, is_Verified } = req.admin;
      const data = await AboutModel.findById(req.params.id);
      // console.log(data);
      res.render("admin/about/viewabout", { view: data, is_Verified: is_Verified });
    } catch (err) {
      console.log(err);
    }
  };

  static deleteabout = async (req, res) => {
    try {
      //code of deleting the image
      const about = await AboutModel.findById(req.params.id);
      const image_id = about.image.public_id;
      // console.log(image_id)
      await cloudinary.uploader.destroy(image_id);

      await AboutModel.findByIdAndDelete(req.params.id);
      res.redirect("/displayabout");
    } catch (err) {
      console.log(err);
    }
  };
}
module.exports = AboutController;
