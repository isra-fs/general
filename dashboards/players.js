/**
 * Return array with all data foun in table_nfc_order and table_nfc_food
 * @method newPlayer
 * @param {Object} db - This is a instance from sqlite3.Database
 * @param {array} player - data to insert into players
 */
function newPlayer(db, player) {
    console.log(player.name)
    db.run("INSERT INTO players (name,mail,time) VALUES('"+player.name+"','"+player.mail+"',"+player.time+")", function(err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`A row has been inserted with row id ${this.lastID}`);
    });
}
/**
 * Return array with all data foun in table_interactive_MIS
 * @method getMisJsonObject
 * @param {Object} db - This is a instance from sqlite3.Database
 * @param {Callback} callback -Need it for return all data foun in players
 */
function getPlayers(limit,db, callback) {
    let data = [];
    let sql = limit ? 'SELECT * FROM players  ORDER BY time ASC LIMIT 1' : 'SELECT * FROM players  ORDER BY time ASC';
   // let sql = 'SELECT * FROM players  ORDER BY time ASC';
    db.serialize(() => {
        db.each(sql, (err, row) => {
                if (err) {
                    console.error(err.message);
                }
                data.push(row);
            },
            function() { // calling function when all rows have been pulled
                callback(data);
            })
    });
}
/*exporting all functions*/
module.exports.newPlayer = newPlayer;
module.exports.getPlayers = getPlayers;