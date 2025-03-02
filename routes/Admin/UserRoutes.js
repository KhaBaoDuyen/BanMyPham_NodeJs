const express = require("express");
const router = express.Router();
const uploadUser = require('../../server').uploadUser; 
const UserController = require("../../controllers/Admin/UserController");



router.get('/admin/user/list', UserController.get);

router.get('/admin/user/update/:id', UserController.updateFrom);
router.patch('/admin/user/update/:id', uploadUser.single("image"), UserController.update);

router.delete('/admin/user/delete/:id', UserController.delete);

module.exports = router;
