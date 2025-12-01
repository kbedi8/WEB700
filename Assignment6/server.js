/********************************************************************************
*  WEB700 – Assignment 06
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Kunwar Bedi Student ID: 106681232 Date: 30-11-2025
*
*  Published URL: ___________________________________________________________
*
********************************************************************************/ 

const express = require("express");
const path = require("path");
const LegoData = require("./modules/legoSets");

const app = express();
const legoData = new LegoData();
const HTTP_PORT = process.env.PORT || 8080;

// Static files
app.use(express.static(path.join(__dirname, "public")));

// EJS view engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware for form data
app.use(express.urlencoded({ extended: true }));

// -------------------- ROUTES -------------------- //

// Home
app.get("/", (req, res) => {
    res.render("home");
});

// About
app.get("/about", (req, res) => {
    res.render("about");
});

// Show form to add a set
app.get("/lego/addSet", async (req, res) => {
    try {
        const themes = await legoData.getAllThemes();
        res.render("addSet", { themes });
    } catch (err) {
        res.status(500).render("500", { message: "Unable to load Add Set page: " + err });
    }
});

// Handle form submission for new set
app.post("/lego/addSet", async (req, res) => {
    try {
        await legoData.addSet(req.body); // Sequelize handles theme_id
        res.redirect("/lego/sets");
    } catch (err) {
        res.status(500).render("500", { message: "Unable to Add Set: " + err });
    }
});

// All sets / sets by theme (rendered as a table)
app.get("/lego/sets", async (req, res) => {
    try {
        const theme = req.query.theme;
        const legoSets = theme
            ? await legoData.getSetsByTheme(theme)
            : await legoData.getAllSets();

        res.render("sets", { sets: legoSets });
    } catch (err) {
        res.status(404).render("404", { message: "Unable to retrieve requested sets" });
    }
});

// Single set details
app.get("/lego/sets/:set_num", async (req, res) => {
    try {
        const set = await legoData.getSetByNum(req.params.set_num);
        res.render("set", { set });
    } catch (err) {
        res.status(404).render("404", { message: "Set not found" });
    }
});

// Delete a set
app.get("/lego/deleteSet/:set_num", async (req, res) => {
    try {
        await legoData.deleteSetByNum(req.params.set_num);
        res.redirect("/lego/sets");
    } catch (err) {
        res.status(500).render("500", { message: "Unable to delete set: " + err });
    }
});

// Custom 404
app.use((req, res) => {
    res.status(404).render("404", { message: "Sorry, the page you are looking for does not exist." });
});

// -------------------- START SERVER -------------------- //
(async () => {
    try {
        await legoData.initialize();
        app.listen(HTTP_PORT, () => {
            console.log(`Server running at http://localhost:${HTTP_PORT}`);
        });
    } catch (err) {
        console.error("Failed to initialize Lego data:", err);
    }
})();
