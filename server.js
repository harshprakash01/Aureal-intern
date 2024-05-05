// app.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();


app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost/animalDirectory', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Animal model
const Animal = require('./models/Animal');

// Routes
// Get all animals
app.get('/animals', async (req, res) => {
    try {
        const animals = await Animal.find();
        res.json(animals);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Add new animal
app.post('/animals', async (req, res) => {
    const { name, species, age } = req.body;

    try {
        const newAnimal = new Animal({
            name,
            species,
            age
        });

        const animal = await newAnimal.save();
        res.json(animal);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update animal
app.put('/animals/:id', async (req, res) => {
    const { name, species, age } = req.body;

    try {
        let animal = await Animal.findById(req.params.id);

        if (!animal) {
            return res.status(404).json({ msg: 'Animal not found' });
        }

        animal.name = name;
        animal.species = species;
        animal.age = age;

        animal = await animal.save();
        res.json(animal);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete animal
app.delete('/animals/:id', async (req, res) => {
    try {
        let animal = await Animal.findById(req.params.id);

        if (!animal) {
            return res.status(404).json({ msg: 'Animal not found' });
        }

        await animal.remove();
        res.json({ msg: 'Animal removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
