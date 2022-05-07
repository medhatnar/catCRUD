const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// main page
// cats
// cats:id/option

// register
// login



// app.post("/register", (req, res) => {
//     // our register logic goes here...
//     });
    
//     // Login
// app.post("/login", (req, res) => {
//     // our login logic goes here
// });