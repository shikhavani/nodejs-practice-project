const express = require('express');
const app = express();

app.use('/', (req,res) => {
    res.send('Hello, Dashboard!');
});

app.use('/profile', (req,res) => {
    res.send('Hello, Profile!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
