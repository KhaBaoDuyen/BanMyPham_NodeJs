const express = require('express');
const router = express.Router();
const uploadProduct = require('../../server').uploadProduct; 
const indexController = require("../../controllers/Client/indexController");
const productController = require("../../controllers/Client/Page/ProductController");


console.log(uploadProduct); 

router.get('/',indexController.getClient);

router.get("/about", indexController.getAbout);
router.get("/contact", indexController.getContact);

module.exports = router;
