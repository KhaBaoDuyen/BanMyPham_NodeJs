const express = require("express");
const router = express.Router();
const uploadCategory = require('../../server').uploadCategory; 
const CategoryController = require("../../controllers/Admin/CategoryController");


router.get('/admin/category/list', CategoryController.get);

router.get('/admin/category/create', CategoryController.createFrom);
router.post("/admin/category/create", uploadCategory.single("image"), CategoryController.create);

router.get('/admin/category/update/:id', CategoryController.updateFrom);
router.patch('/admin/category/update/:id', uploadCategory.single("image"), CategoryController.update);

router.delete('/admin/category/delete/:id', CategoryController.delete);

module.exports = router;
