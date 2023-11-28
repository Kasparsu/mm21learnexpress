const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


router.get('/api/messages', async (req, res) => {
    let messages = [];
  
    if(req.query.from){
        messages = await prisma.message.findMany({
            where: {
                createdAt: {
                    gte: new Date(req.query.from)
                }
            }
        });
    } else {
        messages = await prisma.message.findMany();
    }
    
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.json(messages);
});
router.get('/api/messages/long', async (req, res) => {
    let messages = [];
    while(messages.length === 0){
        messages = await prisma.message.findMany({
            where: {
                createdAt: {
                    gte: new Date(req.query.from)
                }
            }
        });
        await sleep(1000);
    }
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.json(messages);
});

router.get('/api/messages/sse', async (req, res) => {
    res.writeHead(200, {
		'Content-Type': 'text/event-stream',
		Connection: 'keep-alive',
		'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': 'http://localhost:3000'
	});
    let from = new Date().toISOString();
    let id=1;
    let messages = [];
    while(true){
        messages = await prisma.message.findMany({
            where: {
                createdAt: {
                    gte: new Date(from)
                }
            }
        });
        res.write('event: messages\n');
        res.write(`data: ${JSON.stringify(messages)}\n`);
        res.write(`id: ${id}\n\n`);
        id++;
        from = new Date().toISOString();
        await sleep(1000);
    }
    req.on('close', () => res.end('OK'));
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