const AdminModel = require("../../models/Admin");



const cloudinary = require("cloudinary").v2;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

//cloudinary setup
cloudinary.config({
  cloud_name: "dkktixgdd",
  api_key: "677659928374367",
  api_secret: "IwWks6xCMpol3ZkClkYxzwNH19s",
});

class AdminController {
  static dashboard = async (req, res) => {
    try {
      const { name, email, image, is_Verified } = req.admin;
      res.render("admin/dashboard", { n: name, e: email, img: image, is_Verified: is_Verified });
    } catch (err) { }
  };

  static register = async (req, res) => {
    try {
      // console.log(req.body);
      res.render("admin/register", { message: req.flash("error") });
    } catch (error) {
      console.log(error);
    }
  };

  static admininsert = async (req, res) => {
    try {
      // console.log(req.body);
      // console.log(req.files.image)
      const imagefile = req.files.image;
      //image upload code
      const image_upload = await cloudinary.uploader.upload(
        imagefile.tempFilePath,
        {
          folder: "admin",
        }
      );
      // console.log(image_upload)
      // console.log(req.body);
      const { name, email, phone, address, password, cpassword, image } =
        req.body;
      const admin = await AdminModel.findOne({ email: email });
      // console.log(admin);
      if (admin) {
        req.flash("error", "email already exists");
        res.redirect("/register");
      } else {
        if (name && email && password && cpassword && phone && address) {
          if (password == cpassword) {
            try {
              const hashpassword = await bcrypt.hash(password, 10);
              const result = new AdminModel({
                name: name,
                email: email,
                password: hashpassword,
                phone: phone,
                address: address,
                image: {
                  public_id: image_upload.public_id,
                  url: image_upload.secure_url,
                },
              });
              await result.save();
              req.flash("success", "registeration succesfull");
              res.redirect("/login");
            } catch (error) {
              console.log(error);
            }
          } else {
            req.flash("error", "password & confirm password not found");
            res.redirect("/register");
          }
        } else {
          req.flash("error", "All feilds are required");
          res.redirect("/register");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  static verifylogin = async (req, res) => {
    try {
      // console.log(req.body);
      const { email, password } = req.body;
      if (email && password) {
        const admin = await AdminModel.findOne({ email: email });

        if (admin != null) {
          const ismatched = await bcrypt.compare(password, admin.password);
          if (ismatched) {
            // generate jwt token
            var token = jwt.sign({ ID: admin._id }, "som12345");
            // console.log(token)
            // res.cookie("token", token);
            // res.redirect("/dashboard");
            if (admin.is_Verified === "Admin") {
              res.cookie("token", token);
              res.redirect("/dashboard");
            } else if (admin.is_Verified === "Approved") {
              res.cookie("token", token);
              res.redirect("/dashboard");
            } else if (admin.is_Verified === "Pending") {
              req.flash("error", "You are not approved! Plz wait...");
              res.redirect("/login");
            } else {
              req.flash("error", "Email and password does not match");
              res.redirect("/login");
            }
          } else {
            req.flash("error", "Email or password is incorrect");
            res.redirect("/login");
          }
        } else {
          req.flash("error", "you are not registere user");
          res.redirect("/login");
        }
      } else {
        req.flash("error", "All fields are required");
        res.redirect("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  static logout = async (req, res) => {
    try {
      res.clearCookie("token");
      res.redirect("login");
    } catch (err) {
      console.log(err);
    }
  };

  static changepassword = async (req, res) => {
    try {
      const { name, email, image, is_Verified } = req.admin;
      res.render("admin/changepassword", {
        message3: req.flash("success"),
        message4: req.flash("error"),
        is_Verified: is_Verified

      });
    } catch (err) {
      console.log(err);
    }
  };

  static updatepassword = async (req, res) => {
    try {
      const { email, password, id, is_Verified } = req.admin;
      const { oldpassword, newpassword, cpassword } = req.body;
      if (oldpassword && newpassword && cpassword) {
        const user = await AdminModel.findById(id);
        const ismatch = await bcrypt.compare(oldpassword, user.password);
        if (!ismatch) {
          req.flash("error", "oldpassword is incorrect.");
          return res.redirect("/changepassword");
        } else {
          if (newpassword != cpassword) {
            req.flash("error", "Pasword and confirm password do not match");
            return res.redirect("/changepassword");
          } else {
            const newHashpassword = await bcrypt.hash(newpassword, 10);
            await AdminModel.findByIdAndUpdate(id, {
              $set: { password: newHashpassword },
            });
            req.flash(
              "success",
              "password cahnged succesfully.please login with new password"
            );
          }
          return res.redirect("/logout");
        }
      } else {
      }
    } catch (err) {
      console.log(err);
    }
  };

  static changeprofile = async (req, res) => {
    try {
      const { name, image, email, is_Verified } = req.admin;
      // console.log(image)
      res.render("admin/changeprofile", {
        n: name,
        i: image,
        e: email,
        is_Verified: is_Verified,
        error: req.flash("error"),
      });
    } catch (err) {
      console.log(err);
    }
  };

  static updateprofile = async (req, res) => {
    try {
      // console.log(req.files.image)
      if (req.files) {
        //deleting the image
        const admin = await AdminModel.findById(req.admin.id);
        const imageid = admin.image.public_id;

        // console.log(imageid)

        await cloudinary.uploader.destroy(imageid);

        //second update,age

        const imagefile = req.files.image;
        //image upload code
        const myImage = await cloudinary.uploader.upload(
          imagefile.tempFilePath,
          {
            folder: "adminimage",
          }
        );

        var data = {
          name: req.body.name,
          email: req.body.email,
          image: {
            public_id: myImage.public_id,
            url: myImage.secure_url,
          },
        };
      } else {
        var data = {
          name: req.body.name,
          email: req.body.email,
        };
      }
      const id = req.admin.id;
      await AdminModel.findByIdAndUpdate(id, data);
      res.redirect("/changeprofile");
    } catch (err) {
      console.log(err);
    }
  };

  static user = async (req, res) => {
    try {
      const { name, email, image, is_Verified } = req.admin;
      const data = await AdminModel.find();
      // console.log(data);
      res.render("admin/user/displayuser", { d: data, is_Verified: is_Verified });
    } catch (error) {
      console.log(error);
    }
  };


  static userview = async (req, res) => {
    try {
      const { name, email, image, is_Verified } = req.admin;
      // console.log(req.params.id)
      const data = await AdminModel.findById(req.params.id);
      // console.log(data)
      res.render("admin/user/view", { view: data, is_Verified: is_Verified });
    } catch (err) {
      console.log(err);
    }
  };

  static userdelete = async (req, res) => {
    try {
      const id = req.params.id;
      const data = await AdminModel.findByIdAndDelete(id);
      res.redirect("/displayuser");
    } catch (error) {
      console.log(error);
    }
  };

  static update_approve = async (req, res) => {
    try {
      // console.log(req.body)
      const { is_Verified, email, name } = req.body;
      //console.log(is_Verified, email, name)
      const update = await AdminModel.findByIdAndUpdate(req.params.id, {
        is_Verified: req.body.is_Verified,
        comment: req.body.comment,
      });
      this.sendEmail(email, name, is_Verified);
      res.redirect("/displayuser")
    } catch (error) {
      console.log(error);
    }
  };

  static sendEmail = async (email, name, is_Verified) => {
    // connect witn the smtp server

    let transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,

      auth: {
        user: "som711verma@gmail.com",
        pass: "ptjnsrgoazqkiven",
      },
    });
    let info = await transporter.sendMail({
      from: "test@gmail.com", // sender address
      to: email, //list of receivers
      subject: `Create Blog Registration <b> ${is_Verified} </b> Succesfully`,
      text: "hello",
      html: `<b>${name}</b> Registration is <b> ${is_Verified} </b> Succesfull`,
    });
  };


}

module.exports = AdminController;
