const ContactModel = require("../../models/Contact");
class ContactController {
  static insertcontact = async (req, res) => {
    try {

      const insert = await new ContactModel({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        message: req.body.message,
      });
      await insert.save();
      // console.log(insert)
      res.redirect("/contact");
    } catch (err) {
      console.log(err);
    }
  };

  static displaycontact = async (req, res) => {
    try {
      const { name, email, image, is_Verified } = req.admin;
      const data = await ContactModel.find();
      // console.log(data)
      res.render("admin/contact/displaycontact", { d: data, is_Verified: is_Verified });
    } catch (err) {
      console.log(err);
    }
  };

  static deletecontact = async (req, res) => {
    try {
      const id = req.params.id;
      const data = await ContactModel.findByIdAndDelete(id);
      res.redirect("/displaycontact");
    } catch (error) {
      console.log(error);
    }
  };
}
module.exports = ContactController;
