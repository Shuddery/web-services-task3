const express = require('express');
const dotenv = require('dotenv').config({path: '../.env'}).parsed;
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

app.use(bodyParser.json());

const ordersService = `http://localhost:${dotenv.ORDER_PORT}`;

const customers = [
    {
        id: 1,
        name: 'Vasiliy',
        electricians: [],
    },
    {
        id: 2,
        name: 'Petr',
        electricians: [],
    },
    {
        id: 3,
        name: 'Andrew',
        electricians: [],
    },
];

app.get('/customers', (req, res) => {
    console.log('Returning customers list');
    res.send(customers);
});

app.post('/createCustomerOrder', (req, res) => {
    if (!req.body.customerId || !req.body.orderId) {
        res.status(400).send({ problem: 'Invalid body' });
        return;
    }
    request.post({
        headers: { 'content-type': 'application/json' },
        url: `${ordersService}/customer/${req.body.orderId}`,
        body: JSON.stringify({
            customerId: req.body.customerId,
            customerName: customers.find(customer => customer.id === +req.body.customerId).name
        })
    }, (err, response, body) => {
        if (!err) {
            const customerId = parseInt(req.body.customerId);
            const customer = customers.find(electrician => electrician.id === customerId);
            const body = req.body;
            if ('electricians' in body && Array.isArray(body.electricians)) {
                const electricians = body.electricians
                    .filter((electrician) => electrician)
                    .map((electrician) => electrician.toLowerCase());
                customer.electricians = Array.from(new Set([...customer.electricians, ...electricians]));
                res.status(202).send(customer);
            } else {
                res.status(400).send({ problem: 'Electricians should be array' });
            }
        } else {
            res.status(400).send({ problem: err });
        }
    });
});

app.listen(
    dotenv.CUSTOMER_PORT,
    () => console.log(`Customer listening on port ${dotenv.CUSTOMER_PORT}`)
);