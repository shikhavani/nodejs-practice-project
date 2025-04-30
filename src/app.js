const express = require('express');
const app = express();


app.get('/getUserProfile', (req,res) => {
    // route handler
    console.log(req.query)
    res.send('Hello!, ' + req.query.id);
});

app.get('/getUserName/:name', (req,res) => {
    console.log(req.params);
    res.send('Hello!, ' + req.params.name);
});

app.post('/saveUser', (req,res) => {
    res.send('User saved!');
});

app.delete('/deleteUser', (req,res) => {
    console.log(req.query)
    res.send('User deleted!');
});


// handle any type of http- get/post/delete/put
app.use('/', 
    (req,res, next) => {
        console.log('route handler 1');
        // res.send('Hello, Dashboard 1!');
        // for next handler to be executed
        next();
    },
    (req,res, next) => {
        console.log('route handler 2');
        next();
        // final response to be sent
        // res.send('Hello, Dashboard 3!');
    },
    (req,res) => {
        console.log('route handler 3');
        // final response to be sent
        res.send('Hello, Dashboard 3!');
    },
);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});