/**
 * Return array with all data foun in table_elevator_download and table_elevator
 * @method elavator
 * @param {Object} db - This is a instance from sqlite3.Database
 * @param {Callback} callback -Need it for return all data foun in table_elevator_download
 */
function elavator(db, callback) {
    let data = [];
    db.serialize(() => {
        db.all(`SELECT  id,name,duration FROM table_elevator`, (err, row) => {
            if (err) {
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!".cyan)
                console.error(err.message.red);
            }
            data.push({ videos: row });
        });
        db.all(`SELECT id,name,
                sum(CASE WHEN table_elevator_download.date >=  date('now', 'localtime') THEN table_elevator_download.quantity ELSE 0 END) as "today",
                sum(table_elevator_download.quantity) as "total"
                FROM table_elevator INNER JOIN  table_elevator_download on  table_elevator.id =table_elevator_download.elevator GROUP BY elevator ORDER BY
                table_elevator.id  ASC`, (err, row) => {
            if (err) {
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!".cyan)
                console.error(err.message.red);
            }
            data.push({ numberOfElevatorDownload: row });
        });
        db.all(`SELECT id,name,
                sum(CASE WHEN table_elevator_video.date >=  date('now', 'localtime') THEN table_elevator_video.quantity ELSE 0 END) as "today",
                sum(table_elevator_video.quantity) as "total"
                FROM table_elevator INNER JOIN  table_elevator_video on  table_elevator.id =table_elevator_video.elevator GROUP BY elevator ORDER BY
                table_elevator.id  ASC`, (err, row) => {
            if (err) {
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!".cyan)
                console.error(err.message.red);
            }
            data.push({ NumberOfContentPlay: row });
        });
        /**
         * @method chicanada
         */
        db.all(``, (err, row) => {}, function() { callback(data); })
    });
}

/**
 * insert  in table_elevator_video
 * @method newElevatorVideoPlay
 * @param {Object} db - This is a instance from sqlite3.Database
 * @param {array} elevator - video play 
 */
function newElevatorVideoPlay(db, elevator) {

    db.run("INSERT INTO table_elevator_video (elevator,date,quantity) VALUES(" + elevator.id + ",'" + elevator.date + "',1 )", function(err) {
        if (err) {
            return console.error(err.message + " hyper_market_elevator");
        }
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!".gray)
        console.log(`A row has been inserted with row id ${this.lastID}`);
    });
}

/**
 * Return array with all data foun in table_nfc_order and table_nfc_food
 * @method updateElavatorDownload
 * @param {Object} db - This is a instance from sqlite3.Database
 * @param {array} download - data to insert into table_elevator_download
 */
function newNFCDownload(db, download) {
    db.run("INSERT INTO table_elevator_download (elevator,date,quantity) VALUES(" + download.id + ",'" + download.date + "' ,1)", function(err) {
        if (err) {
            return console.error(err.message + " hyper_market_elevator");
        }
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!".gray)
        console.log(`A row has been inserted with row id ${this.lastID}`);
    });

}
/*exporting all functions*/
module.exports.elavator = elavator;
module.exports.newElevatorVideoPlay = newElevatorVideoPlay;
module.exports.newNFCDownload = newNFCDownload;