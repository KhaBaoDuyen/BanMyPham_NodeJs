const express = require('express');
const router = express.Router();
const uploadProduct = require('../../server').uploadProduct; 
const ProductControllerA = require("../../controllers/Admin/ProductController");
const ProductControllerC = require("../../controllers/Client/Page/ProductController");
const checkRole = require("../../controllers/Admin/checkAuth");

console.log(uploadProduct); 

router.get('/admin',checkRole(0), ProductControllerA.getAdmin);


router.get('/admin/product/list', ProductControllerA.get);

router.get('/admin/product/create', ProductControllerA.createForm);
router.post("/admin/product/create", uploadProduct.array("images", 7), ProductControllerA.create);

router.get('/admin/product/edit/:id', ProductControllerA.editForm);
router.patch('/admin/product/edit/:id', uploadProduct.array('images',7), ProductControllerA.edit);

router.delete('/admin/product/delete/:id', ProductControllerA.delete);
router.post("/admin/product/delete-image/:id", ProductControllerA.deleteImage);


module.exports = router;
