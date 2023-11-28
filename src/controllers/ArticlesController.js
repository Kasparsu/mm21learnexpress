const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/articles', async (req, res) => {
    let articles = await prisma.article.findMany();
    res.render('articles.njk', {articles});
});

router.get('/api/articles', async (req, res) => {
    let articles = await prisma.article.findMany();
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.json(articles);
});

module.exports = router;