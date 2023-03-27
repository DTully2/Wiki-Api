const { render } = require('ejs');
const express  = require('express'); // Express web server framework
const https = require('https'); // HTTPS module
const app = express(); // Create a new Express application
const dotenv = require("dotenv")
dotenv.config()
app.use(express.urlencoded({ extended: true }));  //this is the body parser
app.use(express.json()); //this is the body parser
 
app.set('view engine', 'ejs'); // Set the template engine

app.use(express.static('public')); //static files in public folder

//TODO
//THIS IS WHERE I START WITH MONGOOSE AND MONGO DB
const mongoose = require('mongoose');
const apikey= process.env.REACT_APP_PW2;

//try to connect to mongoose
//this one is for running locally
// mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});
//this one is for running on atlas
 mongoose.connect('mongodb+srv://Tullydev:'+ apikey + '@atlascluster.kqejwjk.mongodb.net/WikiDB?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

//create a schema
const articleSchema= new mongoose.Schema({
  title:{ type:String},
    content:{ type:String}
});
//create a model
const Article = mongoose.model('Articles', articleSchema);


//REQUESTS THAT TARGET ALL ARTICLES
app.route("/articles")
.get(function(req,res){
    Article.find(function(err,foundArticles){
        if(!err){
            // to show to screen on cmd
            console.log(foundArticles);
            //to show on browser
        res.send(foundArticles);

        }else{
            res.send(err);
        }
    });
})

.post(function(req,res){
    // console.log(req.body.content);
    // console.log(req.body.title);
    const article = new Article({
        title:req.body.title,
        content:req.body.content
    });
    article.save(function(err){
        if(!err){
            res.send("Successfully added a new article");
        }else{
            res.send(err);
        }
    });

})

.delete(function(req,res){   
    Article.deleteOne({ _id: req.body._id },function(err){
        if(!err){
            res.send("Successfully deleted all articles");
        }else{
            res.send(err);
        }
    });

   
    // Article.findByIdAndDelete(req.params.id,function(err){
    //     if(!err){
    //         res.send("Successfully deleted an article");
    //     }else{
    //         res.send(err);
    //     }
    // });
});
//REQUESTS THAT TARGET A SPECIFIC ARTICLE
app.route("/articles/:articleTitle")

.get(function(req,res){
    
    Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        }else{
            res.send("No articles matching that title was found");
        }
    });
    })
.put(function(req,res){
    Article.replaceOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite:true},
        function(err){
            if(!err){
                res.send("Successfully updated article");
            }
        }
    );    
})
.patch(function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle},
        //this is the update but it is dynamic so it can be changed to anything in the bodyparsers format.
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Successfully updated article");
            }else{
                res.send(err);
            }   
        }
    )
})
.delete(function(req,res){
    Article.deleteOne({title: req.params.articleTitle},function(err){
        if(!err){
            res.send("Successfully deleted an article");
        }else{
            res.send(err);
        }
    });
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
