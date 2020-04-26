const express = require('express');
const PORT = 3000;
const app = express();
const Joi = require("joi");
const dotenv = require("dotenv");

app.use(express.json());
dotenv.config();
console.log("process.env", process.env);


app.get('/hello', (req,res,next) =>  {
    console.log("request body", req.body);
    res.send('Hello World');
});

app.get ("/weather", (req,res,next)=> {
    const weatherRules = Joi.object({
        lat: Joi.string().required(),
        lon:Joi.string().required(),
    });
    const validationResult = Joi.validate(req.query, weatherRules);
    if(validationResult.error) {
        return res.status(400).send(validationResult.error);
    }

    next();

}, (req,res, next) => {
    console.log("req.query", req.query)
    res.json({weather:"sunny"})
})

app.listen(PORT, () => {
    console.log("Started server on port", PORT );
})