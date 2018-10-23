var colors = require('colors');
/**
 * Return array with all data foun in table_nfc_order and table_nfc_food
 * @method tableOrder
 * @param {Object} db - This is a instance from sqlite3.Database
 * @param {Callback} callback -Need it for return all data foun in MIS_table
 */
function tableOrder(db, callback) {
    let data = [];
    let cont = 0;
    db.serialize(() => {
        db.all(`SELECT  date('now', 'localtime') as "date",food,name,type,sum(quantity) as "weekly", 
                    sum(CASE WHEN date >=  date('now', 'localtime') THEN quantity ELSE 0 END) as "today",
                    sum(CASE WHEN  date(date) = date('now','localtime', '-1 days') THEN quantity ELSE 0 END) as "yesterday",
                    sum(CASE WHEN  date(date) = date('now','localtime', '-2 days')  THEN quantity ELSE 0 END) as "day_before_yesterday"
                    FROM table_nfc_order INNER JOIN  table_nfc_food on  table_nfc_food.id =table_nfc_order.food GROUP BY food`, (err, row) => {
            if (err) {
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!".yellow)
                console.error(err.message.red);
            }
            data.push(row);

        })
        db.all(`SELECT  
                    sum(CASE WHEN time(date)    >=  '09:00:00' and time(date) < '09:30:00' THEN quantity ELSE 0 END) as "1",
                    sum(CASE WHEN time(date)    >=  '09:30:00' and time(date) < '10:00:00' THEN quantity ELSE 0 END) as "2",
                    sum(CASE WHEN time(date)    >=  '10:00:00' and time(date) < '10:30:00' THEN quantity ELSE 0 END) as "3",
                    sum(CASE WHEN time(date)    >=  '10:30:00' and time(date) < '11:00:00' THEN quantity ELSE 0 END) as "4",
                    sum(CASE WHEN time(date)    >=  '11:00:00' and time(date) < '11:30:00' THEN quantity ELSE 0 END) as "5",
                    sum(CASE WHEN time(date)    >=  '11:30:00' and time(date) < '12:00:00' THEN quantity ELSE 0 END) as "6",
                    sum(CASE WHEN time(date)    >=  '12:00:00' and time(date) < '12:30:00' THEN quantity ELSE 0 END) as "7",
                    sum(CASE WHEN time(date)    >=  '12:30:00' and time(date) < '13:00:00' THEN quantity ELSE 0 END) as "8",
                    sum(CASE WHEN time(date)    >=  '13:00:00' and time(date) < '13:30:00' THEN quantity ELSE 0 END) as "9",
                    sum(CASE WHEN time(date)    >=  '13:30:00' and time(date) < '14:00:00' THEN quantity ELSE 0 END) as "10",
                    sum(CASE WHEN time(date)    >=  '14:00:00' and time(date) < '14:30:00' THEN quantity ELSE 0 END) as '11',
                    sum(CASE WHEN time(date)    >=  '14:30:00' and time(date) < '15:00:00' THEN quantity ELSE 0 END) as "12",
                    sum(CASE WHEN time(date)    >=  '15:00:00' and time(date) < '15:30:00' THEN quantity ELSE 0 END) as "13",
                    sum(CASE WHEN time(date)    >=  '15:30:00' and time(date) < '16:00:00' THEN quantity ELSE 0 END) as "14",
                    sum(CASE WHEN time(date)    >=  '16:00:00' and time(date) < '16:30:00' THEN quantity ELSE 0 END) as "15",
                    sum(CASE WHEN time(date)    >=  '16:30:00' and time(date) < '17:00:00' THEN quantity ELSE 0 END) as "16"
                    FROM table_nfc_order INNER JOIN  table_nfc_food on  table_nfc_food.id =table_nfc_order.food GROUP BY food`, (err, row) => {
            if (err) {
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!".yellow)
                console.error(err.message.red);
            }
            data.push({ hours: row });
        });
        /**
         * @method chicanada
         */
        db.all(``, (err, row) => {}, function() { callback(data); })
    });
}
/**
 * Return array with all data foun in table_nfc_order and table_nfc_food
 * @method randomTimeMenu
 * @param {Object} db - This is a instance from sqlite3.Database
 * @param {Callback} callback -Need it for return all data foun in MIS_table
 */
function randomTimeMenu() {
    let time_prepare_menu = [];
    for (let i = 0; i < 9; i++) {
        let randomTime = (Math.random() * (8.120 - 1.0200) + 1.0200).toFixed(2);
        time_prepare_menu.push(randomTime);
    }
    return { "time_to_prepare_menu": time_prepare_menu };
}
/**
 * Return array with all data foun in table_nfc_order and table_nfc_food
 * @method createOrder
 * @param {Object} db - This is a instance from sqlite3.Database
 * @param {array} orders - data to insert into table_nfc_order
 */
function createOrder(db, orders) {
    for (let i = 0; i < orders.length; i++) {
        db.run("INSERT INTO table_nfc_order(food,quantity,date) VALUES(" + orders[i].id + ", 1 ,'" + orders[i].date + "' )", function(err) {
            if (err) {
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!".yellow)
                return console.log(err.message + " createOrder table_order".red);
            }
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!".yellow)
            console.log(`A row has been inserted with row id ${this.lastID}`.yellow);
        });
    }
}
/*exporting all functions*/
module.exports.randomTimeMenu = randomTimeMenu;
module.exports.createOrder = createOrder;
module.exports.tableOrder = tableOrder;