const express = require ("express")
const app = express()
const connection = require("./database/database")
//TRABALHAR COM SESSÃO NO EXPRESS
const session = require("express-session")

const categoriesController = require ("./categories/CategoriesController")
const articlesController = require("./articles/ArticlesController")
const usersController = require("./users/UsersController")

//IMPORTANDO OS MODELS DE CONEXÃO COM O BANCO
const Article = require("./articles/Article")
const Category = require("./categories/Category")
const User = require("./users/User")

//View Engine
app.set('view engine','ejs')

//CONFIGURAR SESSÕES
app.use(session({
    secret: "qualquercoisa",cookie:{maxAge: 30000000}
}))

//Arquivos estáticos
app.use(express.static('public'))

//Database
connection
    .authenticate()
    .then(()=>{
        console.log("Conexão feita com sucesso!")
    }).catch((error)=>{
        console.log(error)
    })

app.use(express.urlencoded({extended: true}))
app.use(express.json())



app.use("/",categoriesController)
app.use("/",articlesController)
app.use("/",usersController)

//CRIANDO ROTA SESSION
app.get("/session",(req,res)=>{
    req.session.treinamento = "Formação Node.js"
    req.session.ano = 2021
    req.session.email = "dan.trabalho94@gmail.com"
    req.session.user={
        username: "danilogozzi",
        email: "email@email.com",
        id: 10
    }
    res.send("Sessão gerada!")
})


app.get("/leitura",(req,res)=>{
    res.json({
        treinamento: req.session.treinamento,
        ano:req.session.ano,
        email: req.session.user
    })
})
app.get("/", (req,res)=>{
    Article.findAll({
        order:[
            ['id','DESC']
        ],limit:4
    }).then(articles =>{
        Category.findAll().then(categories=>{
            res.render("index",{articles: articles,categories:categories})
        })
    })
})

app.get("/:slug",(req,res)=>{
    var slug = req.params.slug
    Article.findOne({
        where:{
            slug:slug
        }
    }).then(article=>{
        if(article != undefined){
            //achando o artigo na rota
            Category.findAll().then(categories=>{
                res.render("article",{article: article,categories:categories})
            })
        }else{
            res.redirect('/')
        }
    }).catch(err=>{
        res.redirect("/")
    })
})

app.get("/category/:slug",(req,res)=>{
    var slug = req.params.slug
    Category.findOne({
        where:{
            slug:slug
        },
        include:[{model:Article}]
    }).then(category =>{
        if(category != undefined){
            Category.findAll().then(categories =>{
                res.render("index",{articles: category.articles,categories:categories})
            })
        }else{
            res.redirect("/")
        }
    }).catch(err =>{
        res.redirect("/")
    })
})

app.listen(8080,()=>{
    console.log("O servidor está rodando!")
})