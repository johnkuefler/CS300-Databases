var express = require('express');
var router = express.Router();
var Pet = require('../models/pet');

router.get('/api', async function(req, res, next) {
    if (req.query.key != "1234xyz") {
         return res.status(401).send("Unauthorized");
    }

    var pets = await Pet.find();
  
    res.send(pets);
  });

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

router.get('/edit', async function(req, res, next) {
    let id = req.query._id;

    let pet = await Pet.findById(id);

    res.render('edit', {pet: pet });
});

router.post('/edit', async function(req, res, next) {
    await Pet.findOneAndUpdate({_id: req.body._id}, {
        name: req.body.name,
        type: req.body.type,
        age: req.body.age
    });

    res.redirect('/pets');
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