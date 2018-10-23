//sqlite3 require file
const sqlite3 = require('sqlite3').verbose();
//sqlite instance
var db = new sqlite3.Database('db/dashboard.db');
var express = require('express');
var port = 3001;
var app = express();
var server = require('http').Server(app);
var bodyParser = require("body-parser");
var io = require('socket.io')(server);
//external files
var my_player = require('./dashboards/players');
app.use(express.static(__dirname + '/node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// POST market_elevator_download
app.post('/player', (req, res) => {
    try {
        let player = req.body;
        console.log(player)
        //let player = { id: 1, date: '2018-01-26' }
        my_player.newPlayer(db, player);
       // getElevator();
    } catch (error) {  
        res.status(500).send('Something broke!')
    }
    res.end('Ok,request was successfull');
});
app.get('/list_player', function (req, res) {
    res.sendFile(__dirname + '/table.html');    
})
/*table_order functios*/
var getListPlayers = () => {
    my_player.getPlayers(false,db,(data)=>{
        io.emit('listPlayers', data); 
    });   
};
io.on('connection', function(socket) {
    socket.on("getListPlayers",(data)=>{
        getListPlayers();
    })
})
/*END: table_order functions*/
server.listen(port, () => {
    console.log('Central Servers is running: ' + server.address().address + ':' + port);
});