/**
 * Return array with all data foun in table_cashier_buy and table_cashier_play
 * @method tableOrder
 * @param {Object} db - This is a instance from sqlite3.Database
 * @param {Callback} callback -Need it for return all data foun in table_cashier_video
 */
function market_cashier(db, callback) {
    let data = [];
    db.serialize(() => {
        db.all(`SELECT  id,name,type FROM table_cashier_video`, (err, row) => {
            if (err) {
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!".magenta)
                console.error(err.message.red);
            }
            data.push({ videos: row });
        });
        db.all(`SELECT id,name,
                sum(CASE WHEN table_cashier_buy.date >=  date('now', 'localtime') THEN table_cashier_buy.quantity ELSE 0 END) as "today",
                sum(table_cashier_buy.quantity) as "total"
                FROM table_cashier_video INNER JOIN  table_cashier_buy on  table_cashier_video.id =table_cashier_buy.video GROUP BY video
                ORDER BY table_cashier_video.id  ASC`, (err, row) => {
            if (err) {
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!".magenta)
                console.error(err.message.red);
            }
            data.push({ numberOfPurchases: row });
        });
        db.all(`SELECT id,name,
                sum(CASE WHEN table_cashier_play.date >=  date('now', 'localtime') THEN table_cashier_play.quantity ELSE 0 END) as "today",
                sum(table_cashier_play.quantity) as "total"
                FROM table_cashier_video INNER JOIN  table_cashier_play on  table_cashier_video.id =table_cashier_play.video GROUP BY video ORDER BY
                table_cashier_video.id  ASC`, (err, row) => {
            if (err) {
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!".magenta)
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
 * Insert in play table_cashier_play
 * @method newVideoPlay
 * @param {Object} db - This is a instance from sqlite3.Database
 * @param {array} video - data to insert into table_cashier_play
 */
function newVideoPlay(db, video) {
    db.run("INSERT INTO table_cashier_play (video,date,quantity) VALUES(" + video.id + ",'" + video.date + "',1 )", function(err) {
        if (err) {
            return console.error(err.message + " hyper_market_cashier");
        }
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!".magenta)
        console.log(`A row has been inserted with row id ${this.lastID}`);
    });
}
/**
 * Insert new buy in table_cashier_buy
 * @method newVideoBuy
 * @param {Object} db - This is a instance from sqlite3.Database
 * @param {array} video - data to insert into table_cashier_buy
 */
function newVideoBuy(db, buy) {
    console.log("insert " + buy.length)
    for (let i = 0; i < buy.length; i++) {
        db.run("INSERT INTO table_cashier_buy (video,quantity,date) VALUES(" + buy[i].id + "," + buy[i].quantity + ",'" + buy.date + "' )", function(err) {
            if (err) {
                return console.error(err.message + " table_cashier_buy");
            }
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!".magenta)
            console.log(`A row has been inserted with row id ${this.lastID}`);
        });
    }
}
/*exporting all functions*/
module.exports.newVideoPlay = newVideoPlay;
module.exports.newVideoBuy = newVideoBuy;
module.exports.market_cashier = market_cashier;