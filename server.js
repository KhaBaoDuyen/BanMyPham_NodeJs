require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const multer = require('multer');
const methodOverride = require('method-override');
const session = require("express-session");
const flash = require('express-flash');
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const { Sequelize, Op } = require('sequelize');
const ProductModel = require('./models/ProductModel');

const cookieParser = require("cookie-parser");
app.use(cookieParser());


// const OrderController = require('./controllers/OrderController');
// const sendOrderConfirmation = require('./services/bot');  

app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.use('/services', express.static(path.join(__dirname, 'services'), {
   setHeaders: (res, path) => {
      if (path.endsWith('.js')) {
         res.setHeader('Content-Type', 'application/javascript');
      }
   }
}));


app.set("views", path.join(__dirname, "View"));
app.set("view engine", "ejs");

app.use(session({
   secret: process.env.SESSION_SECRET,
   resave: false,
   saveUninitialized: true,
   cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      secure: false
   },
}));


app.use((req, res, next) => {
   res.locals.user = req.session.user || null;
   next();
});


app.use(flash());

app.use((req, res, next) => {
   console.log(req.session);
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});

app.use((req, res, next) => {
   if (req.cookies.user) {
      try {
         res.locals.user = JSON.parse(req.cookies.user);
      } catch (error) {
         console.error("Lỗi parse cookie:", error);
         res.locals.user = null;
      }
   } else {
      res.locals.user = null;
   }
   next();
});

const storageProduct = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, "public/assets/uploads/Products");
   },
   filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
   }
});
const storageCategory = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, "public/assets/uploads/Categories");
   },
   filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
   }
});
const storageUser = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, "public/assets/uploads/Users");
   },
   filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
   }
});
const fileImage = (req, file, cb) => {
   const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
   if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
   } else {
      cb(new Error("Chỉ cho phép định dạng JPG, JPEG, PNG"), false);
   }
};
const uploadProduct = multer({
   storage: storageProduct,
   fileFilter: fileImage,
   limits: { fileSize: 5 * 1024 * 1024 }
});
const uploadCategory = multer({
   storage: storageCategory,
   fileFilter: fileImage,
   limits: { fileSize: 5 * 1024 * 1024 }
});
const uploadUser = multer({
   storage: storageUser,
   fileFilter: fileImage,
   limits: { fileSize: 5 * 1024 * 1024 }
});
module.exports = { uploadProduct, uploadCategory, uploadUser };

const productsRoutes = require('./routes/Admin/ProductRoutes');
const categoryRoutes = require("./routes/Admin/CategoryRoutes");
const userRoutes = require("./routes/Admin/UserRoutes");
const orderRoutes = require("./routes/Admin/OrderRoutes");

//-------------------[ CLIENT ]------------------------
const indexRoutes = require("./routes/Client/indexRoutes")
const productRouter = require("./routes/Client/Page/productRouter");
const authRouter = require("./routes/Client/Page/AuthRouter");
const cartRouter = require("./routes/Client/Page/CartRouter");


const port = 3030;


require('./models/Associations');

// Định nghĩa routes
app.use('/', productsRoutes);
app.use("/", categoryRoutes);
app.use('/', userRoutes);
app.use('/', orderRoutes);

//--------------[ CLIENT ]-------------------
app.use("/", indexRoutes);
app.use("/", productRouter);
app.use("/", authRouter);
app.use("/", cartRouter);
// app.use("/", sendOrderConfirmation);


app.locals.formatCurrency = (value) => {
   return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'vnd'
   }).format(value);
};

app.get('/api/search', async (req, res) => {
   const searchTerm = req.query.term;

   if (!searchTerm) {
      return res.status(400).json({ error: 'nhập từ khóa tìm kiếm.' });
   }

   try {
      const products = await ProductModel.findAll({
         where: {
            name: {
               [Op.like]: `%${searchTerm}%`, 
            },
         },
         order: [
            [Sequelize.literal('LENGTH(name)'), 'ASC'],
         ],
         limit: 5,
      });

      res.json(products);
   } catch (error) {
      console.error('Lỗi khi tìm kiếm:', error);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi tìm kiếm.' });
   }
});

app.listen(port, () => {
   console.log(`http://localhost:${port}`);
});
