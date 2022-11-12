/*************************************************************************
 *  WEB322– Assignment 4
 * I declare that this assignment is my own work in accordance with Seneca Academic
 Policy. No part * of this assignment has been copied manually or electronically from any
 other source
 *  (including 3rd party web sites) or distributed to other students.
 *
 * Name: Melika Hamedani  Student ID: 175474212  Date: 09/11/2022
 *
 * Your app’s URL (from Heroku) :
 *
 * *************************************************************************/
const express = require ("express");
const multer = require ("multer");
const path = require ("path");
const fs = require("fs");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const dataService = require("./data-service");
const exphbs = require("express-handlebars");


const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage: storage });

//HTTP_PORT
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

//Use
app.use(express.static(path.join(__dirname, '/public')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'hbs')
app.use(function(req,res,next) {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/":route.replace(/\/$/,"");
    next();
});


//Handlebars
app.engine('.hbs', exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
        navLink: function (url, options) {
            if (url == app.locals.activeRoute) {
                return `<a href="${url}" class="link active">${options.fn(this)}</a>`
            } else {
                return `<a href="${url}" class="link">${options.fn(this)}</a>`
            }
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}));
app.set('view engine', '.hbs');


//Home
app.get("/", (req, res) => {
    res.render("home")
});


//About
app.get("/about", (req, res) => {
    res.render("about");
});


//Employees
app.get("/employees", (req, res) => {
    if (req.query.status) {
        dataService.getEmployeeByStatus(req.query.status).then((data) => {
            res.json({data});
        }).catch((err) => {
            res.json({message: err});
        })
    }
    else if (req.query.department) {
        dataService.getEmployeesByDepartment(req.query.department).then((data) => {
            res.render("employees", { employees: data });
        }).catch((err) => {
            res.json({message: err});
        })
    }
    else if (req.query.manager) {
        dataService.getEmployeesByManager(req.query.manager).then((data) => {
            res.render("employees", { employees: data });
        }).catch((err) => {
            res.json({message: err});
        })
    }
    else {
        dataService.getAllEmployees().then((data) => {
            res.render("employees", { employees: data });
        }).catch((err) => {
            res.json({message: err});
        })
    }
});

//Employee by Value
app.get("/employee/:value", (req,res) => {
    dataService.getEmployeeByNum(req.params.value).then((data) => {
        res.render("employee", { employee: data });
    }).catch((err) => {
        res.render("employee", { message: "no results" });
    })
});


//Add Employee
app.get("/employees/add", (req, res) => {
    res.render("addEmployee");
});

app.post("/employees/add", (req, res) => {
    dataService.addEmployee(req.body).then(() => {
        res.redirect("/employees");
    }).catch(err => console.log(err))
});

app.post('/employee/update', (req, res) => {
    dataService.updateEmployee(req.body).then(res.redirect("/employees"))
})


//Image
app.get("/images/add", function(req,res){
    res.render('addImage');
});

//multer single function takes the value of the 'name' attribute on the form
app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
});

app.get('/images', (req, res) => {
    fs.readdir('./public/images/uploaded', function (err, images) {
        res.render('images', { images})
    })
})


//Departments
app.get("/departments", function(req,res){
    dataService.getDepartments().then((data) =>{
        res.render("departments", { departments: data })
    }).catch((err)=>{
        res.json({ error: err });
    })
});

//Error
app.get("*", (req, res) => {
    res.status(404).send("Page Not Found");
});

//Start the server
dataService.initialize().then(() => {
    app.listen(HTTP_PORT, onHttpStart);
}).catch(() => {
    console.log("Unable to load data");
});