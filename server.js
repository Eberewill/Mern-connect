const express = require('express')
const port = 8000
const connectDB = require('./config/db');

const app = express()

//init middleware
app.use(express.json({extended: false}))

//use the imported connectDB class and connect to mongo db Database
connectDB();

app.get('/', (req, res) => res.send('Server ApI running'))

//define routes with app.use(routUrl, routFile)
app.use('/api/users', require('./route/api/users'));
app.use('/api/auth', require('./route/api/auth'));
app.use('/api/posts', require('./route/api/posts'));
app.use('/api/profile', require('./route/api/profile'));


app.listen(port, () => console.log(`Server started on port ${port}!`))