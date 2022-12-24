const express = require('express');
const dotenv = require('dotenv').config({path: '../.env'}).parsed;
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

app.use(bodyParser.json());

const ordersService = `http://localhost:${dotenv.ORDER_PORT}`;

const electricians = [
    {
        id: 1,
        name: 'cabel',
        amount: 0,
    },
    {
        id: 2,
        name: 'socket',
        amount: 0,
    },
    {
        id: 3,
        name: 'pipe',
        amount: 0,
    },
];

app.get('/electricians', (req, res) => {
    console.log('Returning electricians list');
    res.send(electricians);
});

app.post('/createElectricianOrder', (req, res) => {
    if (!req.body.electricianId || !req.body.orderId) {
        res.status(400).send({ problem: 'Invalid body' });
        return;
    }
    request.post({
        headers: { 'content-type': 'application/json' },
        url: `${ordersService}/electrician/${req.body.orderId}`,
        body: JSON.stringify({
            electricianId: req.body.electricianId,
            electricianName: electricians.find(electrician => electrician.id === +req.body.electricianId).name
        })
    }, (err, response, body) => {
        if (!err) {
            const electricianId = parseInt(req.body.electricianId);
            const electrician = electricians.find(electrician => electrician.id === electricianId);
            const body = req.body;
            if ('amount' in body && typeof body.amount === 'number' && body.amount > 0) {
                electrician.amount += body.amount;
                res.status(202).send(electrician);
            } else {
                res.status(400).send({ problem: 'Amount should be positive number' });
            }
        } else {
            res.status(400).send({ problem: err });
        }
    });
});

app.listen(
    dotenv.ELECTRICIAN_PORT,
    () => console.log(`Electrician listening on port ${dotenv.ELECTRICIAN_PORT}`)
);