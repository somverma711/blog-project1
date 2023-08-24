const CategoryModel = require("../../models/Category");
var cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dkktixgdd",
  api_key: "677659928374367",
  api_secret: "IwWks6xCMpol3ZkClkYxzwNH19s",
});
class CategoryController {
  static displaycategory = async (req, res) => {
    try {
      const { name, email, image, is_Verified } = req.admin;
      const data = await CategoryModel.find();
      // console.log(data)
      res.render("admin/category/displaycategory", { d: data, is_Verified: is_Verified });
    } catch (err) {
      console.log(err);
    }
  };

  static insertcategory = async (req, res) => {
    // console.log(req.body)

    try {
      // const result = await CategoryModel.create(req.body)
      // console.log(result)
      // console.log(req.files.image)

      //upload image
      const file = req.files.image;
      const myimage = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "categoryimage",
      });

      const result = new CategoryModel({
        blogname: req.body.blogname,
        category: req.body.category,
        image: {
          public_id: myimage.public_id,
          url: myimage.secure_url,
        },
      });
      await result.save();
      // console.log(result)
      res.redirect("/displaycategory");
    } catch (err) {
      console.log(err);
    }
  };

  static viewcategory = async (req, res) => {
    // console.log(req.params.id)
    try {
      const { name, email, image, is_Verified } = req.admin;
      const data = await CategoryModel.findById(req.params.id);
      // console.log(data);
      res.render("admin/category/viewcategory", { view: data, is_Verified: is_Verified });
    } catch (err) {
      console.log(err);
    }
  };
  static editcategory = async (req, res) => {
    try {
      const { name, email, image, is_Verified } = req.admin;
      const data = await CategoryModel.findById(req.params.id);
      res.render("admin/category/editcategory", { edit: data, is_Verified: is_Verified });
      // console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  static updatecategory = async (req, res) => {
    try {
      if (req.files) {
        //code of deleting the image
        const category = await CategoryModel.findById(req.params.id);
        const image_id = category.image.public_id;
        // console.log(image_id)
        await cloudinary.uploader.destroy(image_id);

        //inserting the image
        const file = req.files.image;
        //image upload code
        const myImage = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: "categoryimage",
        });

        var data = {
          blogname: req.body.blogname,
          category: req.body.category,
          image: {
            public_id: myImage.public_id,
            url: myImage.secure_url,
          },
        };
      } else {
        var data = {
          blogname: req.body.blogname,
          category: req.body.category,
        };
      }
      const id = req.params.id;
      await CategoryModel.findByIdAndUpdate(id, data);
      res.redirect("/displaycategory");
    } catch (err) {
      console.log(err);
    }
  };

  static deletecategory = async (req, res) => {
    try {
      //code of deleting the image
      const category = await CategoryModel.findById(req.params.id);
      const image_id = category.image.public_id;
      // console.log(image_id)
      await cloudinary.uploader.destroy(image_id);

      await CategoryModel.findByIdAndDelete(req.params.id);
      res.redirect("/displaycategory");
    } catch (err) {
      console.log(err);
    }
  };
}
module.exports = CategoryController;
