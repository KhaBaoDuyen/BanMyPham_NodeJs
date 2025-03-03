const express = require('express');
const router = express.Router();
const uploadProduct = require('../../server').uploadProduct; 
const ProductControllerA = require("../../controllers/Admin/ProductController");
const ProductControllerC = require("../../controllers/Client/Page/ProductController");
const checkRole = require("../../controllers/Admin/checkAuth");

console.log(uploadProduct); 

router.get('/admin',checkRole(0), ProductControllerA.getAdmin);


router.get('/admin/product/list',checkRole(0), ProductControllerA.get);

router.get('/admin/product/create',checkRole(0), ProductControllerA.createForm);
router.post("/admin/product/create",checkRole(0), uploadProduct.array("images", 5), ProductControllerA.create);

router.get('/admin/product/edit/:id',checkRole(0), ProductControllerA.editForm);
router.patch('/admin/product/edit/:id', checkRole(0), uploadProduct.array('images',5), ProductControllerA.edit);

router.patch('/admin/product/isDelete/:id', checkRole(0), ProductControllerA.isDelete);

router.delete('/admin/product/delete/:id', checkRole(0),ProductControllerA.delete);
router.post("/admin/product/delete-image/:id", checkRole(0),ProductControllerA.deleteImage);


module.exports = router;
