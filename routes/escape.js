const express =require('express');
const router =express.Router(); //using router provided by express
const city_list = require('./city');


router.get("/suggest",(req,res,next)=>{

  console.log("{escape}{suggest}:::query:"+JSON.stringify(req.query));

  let suggestions_arr=[];
  let key_arr=Object.keys(city_list);

  key_arr.forEach((key)=>{
    if(city_list[key]["name"].toLowerCase().includes(req.query.text.toLowerCase()) && suggestions_arr.length<20){
      suggestions_arr.push(city_list[key])
    }
  })

  return res.status(200).json({
    suggestions_arr
  })

});




router.get("/getCitiesInSameCountry",(req,res,next)=>{


  console.log("{escape}{getCitiesInSameCountry}:::query:"+JSON.stringify(req.query));

  let selectedCity=city_list[req.query.selectedCode];
  let countryCodeOfSelecetdCity=selectedCity.countryId;
  similarCities=[selectedCity];


  let key_arr=Object.keys(city_list);

  key_arr.forEach((key)=>{
    if(city_list[key]["countryId"].toLowerCase().includes(countryCodeOfSelecetdCity.toLowerCase()) && similarCities.length<5){
      if(selectedCity!=city_list[key])
      similarCities.push(city_list[key])
    }
  })

  gsonCities=[];

  similarCities.forEach((city)=>{
    let lat=city.location.lat;
    let long=city.location.lon
    let gsonCity={
      "type": "Feature",
      "properties": {
        "title":city.name
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          long,
          lat
        ]
      }
    }

    gsonCities.push(gsonCity);
  })

  console.log("gsonCities:"+JSON.stringify(gsonCities));
  return res.status(200).json({
    gsonCities
  })

});


module.exports = router;
