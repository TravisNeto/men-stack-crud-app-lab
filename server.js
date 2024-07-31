require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const MONGO_URI = process.env.MONGO_URI
const PORT = 3000
const Dog = require('./models/dog')
const logger = require('morgan')
const methodOverride = require('method-override')



app.get('/test', (req, res) => {
    res.render('its working')
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logger ('tiny'))
app.use(methodOverride('_method'))

mongoose.connect(MONGO_URI)

mongoose.connection.once('open', () => {
    console.log('MongoDB is working')
})

mongoose.connection.on('error', () => {
    console.error('MongDB be trippin')
})

app.post('/dogs', async (req, res) => {
    req.body.isReadyToWalk === 'on' || req.body.isReadyToWalk === true? 
    req.body.isReadyToWalk = true : 
    req.body.isReadyToWalk = false
    try {
        const createdDog = await Dog.create(req.body)
        res.redirect(`/dogs/${createdDog._id}`)
    } catch (error) {
        res.status(400).json({msg: error.message})
    }
})

app.get('/dogs/new', (req, res) => {
    res.render('new.ejs')
})

app.get('/dogs', async(req, res) => {
    try {
        const foundDogs = await Dog.find({})
        res.render('index.ejs', {
            dogs: foundDogs
        })
    } catch (error) {
        res.status(400).json({msg: error.message})
    }
})

app.get('/dogs/:id', async (req, res) => {
    try {
        const foundDog = await Dog.findOne({ _id: req.params.id })
        res.render('show.ejs', {
            dog: foundDog
        })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})

app.put('/dogs/:id', async (req, res) => {
    try {
        req.body.isReadyToWalk === 'on' || req.body.isReadyToWalk === true? 
        req.body.isReadyToWalk = true : 
        req.body.isReadyToWalk = false
        const updatedDog = await Dog.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        res.redirect('/dogs')
    } catch (error) {
    res.status(400).json({ msg: error.message })
    }
})

app.get('/dogs/:id/edit', async (req, res) => {
    try {
        const foundDog = await Dog.findOne({ _id: req.params.id})
        res.render('edit.ejs', {dog: foundDog})
    } catch (error) {
        res.status(400).json({msg: error.message})
    }
})

app.delete('/dogs/:id', async (req, res) => {
    try {
        await Dog.findOneAndDelete({ _id: req.params.id })
        res.redirect('/dogs')
    } catch (error) {
        res.status(400).json({ msg: error.message})
    }
})

app.listen(PORT, () => {
    console.log('We in the building' + ` application excepting requests on PORT ${PORT}`)
})