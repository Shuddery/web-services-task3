const express = require('express');
const dotenv = require('../node_modules/dotenv').config({path: '../.env'}).parsed;
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

app.use(bodyParser.json());

const availableOrders = [
    {
        id: 1,
        name: 'Order 1',
        customerId: null,
        customerName: null,
        electricianId: null,
        electricianName: null,
    },
    {
        id: 2,
        name: 'Order 2',
        customerId: null,
        customerName: null,
        electricianId: null,
        electricianName: null,
    },
    {
        id: 3,
        name: 'Order 3',
        customerId: null,
        customerName: null,
        electricianId: null,
        electricianName: null,
    },
];

app.get('/availableOrders', (req, res) => {
    console.log('Returning available orders list');
    res.send(availableOrders);
});

app.post('/electrician/**', (req, res) => {
    const orderId = req.params[0];
    const foundOrderIndex = availableOrders.findIndex(order => order.id === +orderId);

    if (foundOrderIndex !== -1) {
        availableOrders[foundOrderIndex].electricianId = req.body.electricianId;
        availableOrders[foundOrderIndex].electricianName = req.body.electricianName;
        res.status(202).header({
            Location: `http://localhost:${dotenv.ORDER_PORT}/electrician/${orderId}`
        }).send({});
    } else {
        res.status(404).send();
    }
});

app.post('/customer/**', (req, res) => {
    const orderId = req.params[0];
    const foundOrderIndex = availableOrders.findIndex(order => order.id === +orderId);

    if (foundOrderIndex !== -1) {
        availableOrders[foundOrderIndex].customerId = req.body.customerId;
        availableOrders[foundOrderIndex].customerName = req.body.customerName;
        res.status(202).header({
            Location: `http://localhost:${dotenv.ORDER_PORT}/customer/${orderId}`
        }).send({});
    } else {
        res.status(404).send();
    }
});

app.listen(
    dotenv.ORDER_PORT,
    () => console.log(`Orders listening on port ${dotenv.ORDER_PORT}`)
);