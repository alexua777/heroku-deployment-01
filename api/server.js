const express = require("express");
const fetch = require("node-fetch");
const app = express();
const Joi = require("joi");
const dotenv = require("dotenv");
const cors = require("cors");

const PORT = 3000;
dotenv.config();

app.use(express.json());
app.use(addAllowOriginHeader);
app.options('*',addCorsHeader);
// app.use(cors({origin:"http://localhost:3000"}));


app.get("/weather", validateWeatherQueryParams, getWeather);

function validateWeatherQueryParams(req, res, next) {
  const weatherRules = Joi.object({
    lat: Joi.string().required(),
    lon: Joi.string().required(),
  });
  const validationResult = Joi.validate(req.query, weatherRules);

  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }

  next();
}

async function getWeather(req, res, next) {
  const { lat, lon } = req.query;

  const response = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_API_KEY}`
  );
  const responseBody = await response.json();
  if(responseBody.error) {
      return res.status(responseBody.code).send(responseBody.error);
  }
  
  return res.status(200).send(responseBody);
}

function addAllowOriginHeader (req,res,next) {
    res.set("Access-Control-Allow-Origin", "http://localhost:3000");
    next();
}

function addCorsHeader (req,res,next) {
    res.set("Access-Control-Allow-Methods", req.headers['access-control-allow-methods']);
    res.set("Access-Control-Allow-Headers",req.headers['access-control-allow-headers']);

    res.status(200).send();
}

app.listen(PORT, () => {
  console.log("Started server on port", PORT);
});
