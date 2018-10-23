/**
 * Return array with all data foun in table_check_out_buy and table_check_out_play
 * @method market_check_out
 * @param {Object} db - This is a instance from sqlite3.Database
 * @param {Callback} callback -Need it for return all data foun in table_check_out_video
 */
function market_check_out(db, callback) {
    let data = [];
    db.serialize(() => {
        db.all(`SELECT  id,name,type FROM table_check_out_video`, (err, row) => {
            if (err) {
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!".cyan)
                console.error(err.message.red);
            }
            data.push({ videos: row });
        });
        db.all(`SELECT id,name,
                sum(CASE WHEN table_check_out_buy.date >=  date('now', 'localtime') THEN table_check_out_buy.quantity ELSE 0 END) as "today",
                sum(table_check_out_buy.quantity) as "total"
                FROM table_check_out_video INNER JOIN  table_check_out_buy on  table_check_out_video.id =table_check_out_buy.video GROUP BY video`, (err, row) => {
            if (err) {
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!".cyan)
                console.error(err.message.red);
            }
            data.push({ numberOfPurchases: row });
        });
        db.all(`SELECT id,name,
                sum(CASE WHEN table_check_out_play.date >=  date('now', 'localtime') THEN table_check_out_play.quantity ELSE 0 END) as "today",
                sum(table_check_out_play.quantity) as "total"
                FROM table_check_out_video INNER JOIN  table_check_out_play on  table_check_out_video.id =table_check_out_play.video GROUP BY video`, (err, row) => {
            if (err) {
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!".cyan)
                console.error(err.message.red);
            }
            data.push({ numberOfImpressions: row });
        });
        /**
         * @method chicanada
         */
        db.all(``, (err, row) => {}, function() { callback(data); })
    });
}

/**
 * Insert in play table_check_out_play
 * @method newCheckOutPlay
 * @param {Object} db - This is a instance from sqlite3.Database
 * @param {array} video - data to insert into table_check_out_play
 */
function newCheckOutPlay(db, video) {
    console.log(video.id)
    console.log(video.date)
    db.run("INSERT INTO table_check_out_play (video,quantity,date) VALUES(" + video.id + ",1,'" + video.date + "')", function(err) {
        if (err) {
            return console.error(err.message + " hyper_market_self_check_out");
        }
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!".cyan)
        console.log(`A row has been inserted with row id ${this.lastID}`);
    });
}
/**
 * Insert new buy in table_check_out_buy
 * @method newCheckOutBuy
 * @param {Object} db - This is a instance from sqlite3.Database
 * @param {array} video - data to insert into table_check_out_buy
 */
function newCheckOutBuy(db, buy) {
    console.log("insert " + buy.length)
    for (let i = 0; i < buy.length; i++) {
        db.run("INSERT INTO table_check_out_buy (video,quantity,date) VALUES(" + buy[i].id + ",1,'" + buy[i].date + "' )", function(err) {
            if (err) {
                return console.error(err.message + " table_check_out_buy");
            }
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!".cyan)
            console.log(`A row has been inserted with row id ${this.lastID}`);
        });
    }
}
/*exporting all functions*/
module.exports.newCheckOutPlay = newCheckOutPlay;
module.exports.newCheckOutBuy = newCheckOutBuy;
module.exports.market_check_out = market_check_out;