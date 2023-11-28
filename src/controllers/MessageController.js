const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/api/messages', async (req, res) => {
    let messages = await prisma.message.findMany();
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.json(messages);
});

router.post('/api/messages', async (req, res) => {
    let message = await prisma.message.create({
        data: {
            text: req.body.message
        }
    });
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.set('Access-Control-Allow-Headers', 'content-type');
    res.json(message);
});

router.options('/api/messages', async (req, res) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.send();
});

module.exports = router;