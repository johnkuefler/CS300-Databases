var express = require('express');
var router = express.Router();
var Pet = require('../models/pet');

router.get('/', async function(req, res, next) {
  var pets = await Pet.find();

  res.render('pets', {pets: pets} );
});

router.post('/', async function(req, res, next) {
    var pet = new Pet({
        name: req.body.name,
        type: req.body.type,
        age: req.body.age
    });

    try {
        await pet.save();
        res.redirect('/pets');
    } catch (e) {
        console.log(e);
        res.redirect('/');
    }
});

router.get('/delete', async function(req, res, next) {  
    let id = req.query._id;

    try {
        await Pet.findByIdAndDelete(id);
        res.redirect('/pets');
    } catch (e) {
        console.log(e);
        res.redirect('/');
    }
});
module.exports = router;