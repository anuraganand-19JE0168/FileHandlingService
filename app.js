//import modules
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const session = require('express-session');

require('dotenv').config();


//app
const app = express();

app.use(express.json());
// Compression
app.use(compression());

//db
mongoose
    .connect(process.env.MONGO_URI , {
        useNewUrlParser: true,
        useUnifiedTopology: true,
}).then(()=> console.log("DB connected")).catch(err => console.log("DB connection error", err));


// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

//middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors({origin: true, credentials: true}));

//routes
const apiRoutes = require("./routes/fileRoutes");
app.use("/file", apiRoutes);



//handling error
app.use((error, req, res, next)=>{
  res.status(500).json({
    message: error.message,
    stack: error.stack
  })
});

//port
const port = process.env.PORT || 8080;
//listener
app.listen(port, ()=>
    console.log(`server is running on port ${port}`)
);