const Sequelize = require("sequelize")
const connection = require("../database/database")
const Category = require("../categories/Category")


const Article = connection.define('articles',{
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },slug:{
        type: Sequelize.STRING,
        allowNull: false
    },
    body:{
        type: Sequelize.TEXT,
        allowNull: false
    }
})

Category.hasMany(Article)//UMA CATEGORIA TEM MUITOS ARTIGOS
Article.belongsTo(Category)//UM ARTIGO PERTENCE A UMA CATEGORIA

//CRIANDO O RELACIONAMENTO NO BANCO
//Article.sync({force:true})

module.exports = Article