var http = require('http')
    ,app = require('./config/express');

const port = process.env.PORT || 3000
http.createServer(app).listen(3000, function() {
    console.log('Servidor escutando na porta: ' + this.address().port);
});

