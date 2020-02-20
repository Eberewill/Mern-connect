const express = require('express')
const connectDB = require('./config/db');
const path = require ('path')

const app = express()

//init middleware
app.use(express.json({extended: false}))

//use the imported connectDB class and connect to mongo db Database
connectDB();


//define routes with app.use(routUrl, routFile)
app.use('/api/users', require('./route/api/users'));
app.use('/api/auth', require('./route/api/auth'));
app.use('/api/posts', require('./route/api/posts'));
app.use('/api/profile', require('./route/api/profile'));

if(process.env.NODE_ENV ==='production'){
    app.use(express.static('client/build'));

    app.get( '*', ( req, res) =>{
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}!`))