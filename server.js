const express = require('express');
const app = express();

const server = app.listen(7000, () => {
    console.log(`Express running → PORT ${server.address().port}`);
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(express.static('public'));

// application.engine('handlebars', handlebars({ defaultLayout: 'main' }));

// application.get('/', function (req, res) {
//     res.render('index.handlebars', { someProp: 3 });
// });

// application.listen(port);