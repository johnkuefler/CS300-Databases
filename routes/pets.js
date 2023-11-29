var express = require('express');
var router = express.Router();
var Pet = require('../models/pet');
var excel = require('exceljs');

router.get('/excel-export', async function(req, res, next) {
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Pets');

    const pets = await Pet.find();

    worksheet.columns = [
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Type', key: 'type', width: 10 },
        { header: 'Age', key: 'age', width: 10 }
    ];

    worksheet.addRows(pets);

    res.setHeader(
        'content-type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    res.setHeader(
        'content-disposition',
        'attachment; filename=pets.xlsx'
    );

    return workbook.xlsx.write(res).then(function() {
        res.status(200).end();
    });
});

router.get('/csv-export', async function(req, res, next) {
    let pets = await Pet.find();

    let csv = "Name,Type,Age\n";
    for (let pet of pets) {
        csv+= pet.name + "," + pet.type + "," + pet.age + "\n";
    }

    res.header('Content-Type', 'text/csv');
    res.attachment('pets.csv');
    res.send(csv);
});

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
       res.render('servererror', {error: e.message});
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