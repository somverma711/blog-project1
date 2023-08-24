const BlogModel = require("../../models/Blog");
var cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dkktixgdd",
  api_key: "677659928374367",
  api_secret: "IwWks6xCMpol3ZkClkYxzwNH19s",
});

class BlogController {
  static displayBlog = async (req, res) => {
    try {
      const { name, email, image, is_Verified, id } = req.admin;
      const data = await BlogModel.find({ user_id: id }).sort({ id: -1 })
      // const data = await BlogModel.find();
      // console.log(data)
      res.render("admin/blog/display", { d: data, is_Verified: is_Verified });
    } catch (error) {
      console.log(error);
    }
  };

  static insertblog = async (req, res) => {
    try {
      const { name, email, image, is_Verified, id } = req.admin;
      // console.log(req.files.image)
      const file = req.files.image;
      const myImage = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "blogimage",
      });
      // console.log(myImage);
      // const result = await BlogModel.create(req.body)
      const result = new BlogModel({
        title: req.body.title,
        description: req.body.description,
        user_id: id,
        author_name: req.admin.name,
        image: {
          public_id: myImage.public_id,
          url: myImage.secure_url,
        },
      });
      await result.save();
      // console.log(result);
      res.redirect("/displayblog");
    } catch (error) {
      console.log(error);
    }
  };

  static blogview = async (req, res) => {
    try {
      const { name, email, image, is_Verified, } = req.admin;

      // console.log(req.params.id)
      const data = await BlogModel.findById(req.params.id);
      // console.log(data)
      res.render("admin/blog/view", { view: data, is_Verified: is_Verified });
    } catch (err) {
      console.log(err);
    }
  };

  static blogedit = async (req, res) => {
    try {
      const { name, email, image, is_Verified, } = req.admin;
      const data = await BlogModel.findById(req.params.id);
      res.render("admin/blog/edit", { edit: data, is_Verified: is_Verified });
    } catch (err) {
      console.log(err);
    }
  };

  static blogupdate = async (req, res) => {
    try {
      // console.log(req.files.image)
      if (req.files) {
        //deleting the image
        const blog = await BlogModel.findById(req.params.id);
        const imageid = blog.image.public_id;

        // console.log(imageid)

        await cloudinary.uploader.destroy(imageid);

        //second update,age

        const imagefile = req.files.image;
        //image upload code
        const myImage = await cloudinary.uploader.upload(
          imagefile.tempFilePath,
          {
            folder: "blogimage",
          }
        );

        var data = {
          name: req.body.name,
          title: req.body.title,
          description: req.body.description,
          image: {
            public_id: myImage.public_id,
            url: myImage.secure_url,
          },
        };
      } else {
        var data = {
          name: req.body.name,
          title: req.body.title,
          description: req.body.description,
        };
      }
      const id = req.params.id;
      await BlogModel.findByIdAndUpdate(id, data);
      res.redirect("/displayblog");
    } catch (error) {
      console.log(error);
    }
  };

  static blogdelete = async (req, res) => {
    try {

      //code of deleteing the image
      const blog = await BlogModel.findById(req.params.id);
      const image_id = blog.image.public_id;
      // console.log(image_id)
      await cloudinary.uploader.destroy(image_id);

      await BlogModel.findByIdAndDelete(req.params.id);
      res.redirect("/displayblog");
      // console.log(req.params.id);
    } catch (err) {
      console.log(err);
    }
  };

  static userblogAll = async (req, res) => {
    try {
      const { name, email, image, is_Verified, id } = req.admin;
      const data = await BlogModel.find().sort({ id: -1 })

      // console.log(data)
      res.render("admin/blog/userblogAll", { d: data, is_Verified: is_Verified });
    } catch (error) {
      console.log(error);
    }
  };
}
module.exports = BlogController;
