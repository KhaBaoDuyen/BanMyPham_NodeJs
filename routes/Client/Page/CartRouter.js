const express = require('express');
const router = express.Router();
const uploadProduct = require('../../../server').uploadProduct;
const CartController = require("../../../controllers/Client/Page/CartController");
const { CartModel } = require('../../../models/Associations');
const OrderController = require('../../../controllers/Client/Page/OrderController')
const { validateCheck } = require("../../../validator/validateCheck");
const { validationResult } = require("express-validator");


router.get("/cart", CartController.getCart);
router.delete('/deleteCart/:id', CartController.delete);
router.post('/addCart', CartController.create);


router.get("/checkout", OrderController.getCheckout);

// router.post('/check', validateCheck, (req, res, next) => {
//     const errors = validationResult(req);
    
//     if (!errors.isEmpty()) {
//         const formattedErrors = {};
//         errors.array().forEach(error => {
//             formattedErrors[error.param] = error.msg;
//         });

//         return res.status(400).json({ errors: formattedErrors }); // Đảm bảo trả về JSON hợp lệ
//     }
    
//     next(); // Nếu không có lỗi, chuyển tiếp đến controller
// }, OrderController.create);


// router.post('/vnpay', OrderController.paymentVnpay);

// router.get('/thank', (req, res) => {
//    if (!req.session.orderData) {
//       return res.redirect('/');
//    }
//    res.render('Client/Page/Cart/thank', {
//       layout: "Client/layout",
//       title: "Cảm ơn",
//       orderData: req.session.orderData
//    });
// });

router.post('/create', OrderController.create);
router.get('/vnpay_return', OrderController.vnpayReturn);

router.get('/thank', OrderController.thank);

module.exports = router;
