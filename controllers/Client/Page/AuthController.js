const ProductModel = require('../../../models/ProductModel');
const UserModel = require('../../../models/UserModel');
const validatorUser = require("../../../validator/validatorUser");
const sanitizeInput = require("../../../validator/sanitize");
const bcrypt = require('bcrypt');
const express = require("express");
const { body, validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");
const { Sequelize } = require('sequelize');

class AuthController {

   static async getRegister(req, res) {
      try {
         res.status(200).render('Client/Page/Auth/register', {
            layout: "Client/layout",
            title: "Đăng ký"
         });
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   }
   static async create(req, res) {
      try {

         let userInput = sanitizeInput(req.body);

         const { name, email, password } = userInput;

         let validationResult = validatorUser(userInput);

         if (Object.keys(validationResult.errors).length > 0) {
            return res.render("Client/Page/Auth/register", {
               layout: "Client/layout",
               title: "Đăng ký",
               errors: validationResult.errors || {},
               name: userInput.name || "",
               email: userInput.email || "",
               password: ""
            });

         }

         let existingUser = await UserModel.findOne({ where: { email } });
         if (existingUser) {
            return res.render("Client/Page/Auth/register", {
               layout: "Client/layout",
               title: "Đăng ký",
               errors: { email: "Email đã tồn tại!" },
               name: userInput.name || "",
               email: userInput.email || "",
               password: ""
            });
         }

         let user;
         try {
            user = await UserModel.create({ name, email, password });
            console.log(" User đã được tạo:", user);
         } catch (error) {
            console.error(" Lỗi khi tạo user:", error);
            return res.status(500).json({ error: "Lỗi khi tạo người dùng!" });
         }

         if (user) {
            req.flash("success", "Đăng ký thành công!");

            return res.redirect("/login");
         }

         return res.status(500).json({ error: "Không thể tạo tài khoản." });

      } catch (error) {
         console.error("Lỗi server:", error);
         return res.status(500).json({ error: error.message });
      }
   }

   static async getById(req, res) {
      try {
         const { id } = req.params;
         const user = await userModel.findByPk(id);

         if (!user) {
            return res.status(404).json({ message: "Id không tồn tại" });
         }
         res.status(200).json({
            "status": 200,
            "data": user
         });
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   }

   static async getLogin(req, res) {
      try {
         res.render("Client/Page/Auth/login", {
            layout: "Client/layout",
            title: "Đăng nhập",
            email: "",
            password: "",
            errors: {}
         });
      } catch (error) {
         console.error("Lỗi server:", error);
         res.status(500).json({ error: error.message });
      }
   }

   static async login(req, res) {
      const { email, password } = req.body;
      try {
         if (!email || !password) {
            req.flash("error", "Vui lòng nhập email và mật khẩu!");
            return res.render("Client/Page/Auth/login", {
               layout: "Client/layout",
               title: "Đăng nhập",
               errors: { input: "Vui lòng nhập email và mật khẩu!" },
               email: email || "",
               password: password || "",
            });
         }
         const user = await UserModel.findOne({ where: { email } });
         if (!user) {
            req.flash("error", "Email không tồn tại!");
            return res.render("Client/Page/Auth/login", {
               layout: "Client/layout",
               title: "Đăng nhập",
               errors: { email: "Email không tồn tại!" },
               email: email || "",
               password: password || "",
            });
         }
         const isPasswordValid = await bcrypt.compare(password, user.password);
         if (!isPasswordValid) {
            return res.render("Client/Page/Auth/login", {
               layout: "Client/layout",
               title: "Đăng nhập",
               errors: { password: "Mật khẩu không chính xác!" },
               email: email || "",
               password: password || "",
            });
         }

         res.cookie("user", JSON.stringify({
            id: user.id,
            name: user.name
         }), {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
            secure: false
         });

         req.flash("success", "Đăng nhập thành công!");
         return res.status(200).redirect("/");

      } catch (error) {
         console.error("Lỗi server:", error);
         req.flash("error", "Lỗi server. Vui lòng thử lại sau!");
         return res.render("Client/Page/Auth/login", {
            layout: "Client/layout",
            title: "Đăng nhập",
            errors: { server: "Lỗi server. Vui lòng thử lại sau!" },
            email: email || "",
            password: password || "",
         });
      }
   }

//---------------------------- [ LOGOUT ]-----------------------------
   static async logout(req, res) {
      try {
         res.clearCookie("user");

         return res.redirect("/");
      } catch (error) {
         console.error("Lỗi server:", error);
         return res.status(500).json({ message: "Lỗi khi đăng xuất", error: error.message });
      }
   }


   static async update(req, res) {
      try {
         const { id } = req.params;
         let userInput = sanitizeInput(req.body);
         const {
            name,
            email,
            password
         } = req.body;
         let { errors, isValid } = validatorUser(userInput);

         if (!isValid) {
            return res.status(400).json({ message: " Du lieu khong hop le!", errors });
         }
         const user = await userModel.findByPk(id);
         if (!user) {
            return res.status(404).json({ message: "Id không tồn tại" });
         }

         user.name = name;
         user.email = email;
         user.password = password;
         await user.save();

         res.status(200).json({
            message: "Cập nhật thành công",
            user
         });
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   }

}
module.exports = AuthController;