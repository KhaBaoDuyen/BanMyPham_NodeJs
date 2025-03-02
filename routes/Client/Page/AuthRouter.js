const express = require('express');

const { body } = require("express-validator");
const router = express.Router();
const uploadProduct = require('../../../server').uploadProduct; 
const AuthController = require("../../../controllers/Client/Page/AuthController"); 

router.get('/resgister', AuthController.getRegister);

router.post('/resgister', AuthController.create);

router.get('/login', AuthController.getLogin);

router.post(
    "/login",
    [
        body("email").trim().isEmail().withMessage("Email không hợp lệ"),
        body("password").notEmpty().withMessage("Mật khẩu không được để trống"),
    ],
    AuthController.login
);

router.get("/logout", AuthController.logout); 
module.exports = router;
