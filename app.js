//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

//Mongoose Connection
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");
}

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});
const Article = new mongoose.model("Article", articleSchema);

app.get("/", (req, res) => {
  res.send("Hello from Server");
});

//REST API
//articles route

app
  .route("/articles")

  .get(async (req, res) => {
    const articles = await Article.find({});
    res.send(articles);
  })

  .post(async (req, res) => {
    console.log(req.body);
    const article = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    let msg = await article.save();
    res.send("Value saved to articles" + msg);
  })

  .delete(async (req, res) => {
    const del = await Article.deleteMany({});
    res.send(del);
  });

//single document roue

app
  .route("/articles/:article")

  .get(async (req, res) => {
    const article = req.params.article;
    const data = await Article.findOne({ title: article });
    if (data) {
      res.send(data);
    } else {
      res.send("No data found for this article");
    }
  })

  .put(async (req, res) => {
    const replace = await Article.replaceOne(
      { title: req.params.article },
      { title: req.body.title, content: req.body.content }
    );
    if (replace) {
      res.send("Successfully replaced");
    } else {
      res.send(replace);
    }
  })

  .patch(async (req, res) => {
    const update = await Article.updateOne(
      { title: req.params.article },
      { $set: req.body }
    );
    res.send(update);
  })

  .delete(async (req, res) => {
    const del = await Article.findOneAndDelete({ title: req.params.article });
    res.send("Deleted : " + del);
  });

//PORT API
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
