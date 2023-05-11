const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);

app.route('/articles')
    .get(function(req, res){
        Article.find().then(function(docs){
            res.send(docs);
        }).catch((error)=> res.send(error));
    })
    .post(function(req, res){    
        const article = new Article({
            title: req.body.title,
            content: req.body.content
        });
    
        article.save().then(function(doc){
            res.send("Successfully added a new article!");
        }).catch((error) => res.send(error));
    })
    .delete(function(req, res){
        Article.deleteMany().then(function(doc){
            res.send("Successfully deleted all articles");
        }).catch((error) => res.send(error));
    });


app.route("/articles/:article")
    .get(function(req, res){
        Article.findOne({title: req.params.article}).then(function(doc){
            if(doc){
                res.send(doc);
            } else {
                res.send("No article matching that title was found.")
            }
            
        }).catch((error) => res.send(error));
    })
    .put(function(req, res){
        Article.replaceOne(
            {title: req.params.article},
            {title: req.body.title, content: req.body.content}   // needs an entire document that replaces
        ).then(function(doc){
            if(doc){
                res.send("Successfully updated.")
            } else {
                res.send("No article matching that title was found.")
            }
        }).catch((error) => res.send(error));
    })
    .patch(function(req, res){
        Article.updateOne(
            {title: req.params.article},
            {$set: req.body}   // updates only the field specified in request body
        ).then(function(doc){
            if(doc){
                res.send("Successfully updated.")
            } else {
                res.send("No article matching that title was found.")
            }
        }).catch((error) => res.send(error));
    })
    .delete(function(req, res){
        Article.deleteOne({title: req.params.article}).then(function(doc){
            if(doc.deletedCount != 0){
                res.send("Successfully deleted.")
            } else {
                res.send("No article matching that title was found.")
            }   
        }).catch((error) => res.send(error));
    });


app.listen(8080, function(){
    console.log("Server running at port 8080");
});
