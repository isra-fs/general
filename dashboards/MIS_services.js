/**
 * Return array with all data foun in table_interactive_MIS
 * @method getMisJsonObject
 * @param {Object} db - This is a instance from sqlite3.Database
 * @param {String} MIS_id - id of json
 * @param {Callback} callback -Need it for return all data foun in MIS_table
 */
function getMisJsonObject(db, MIS_id, callback) {
    let data = [];
    let sql = 'SELECT json FROM table_interactive_MIS where id=' + "'" + MIS_id + "'";
    db.serialize(() => {
        db.each(sql, (err, row) => {
                if (err) {
                    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!".green)
                    console.error(err.message + "MIS_services.js");
                }
                data.push(row);
            },
            function() { // calling function when all rows have been pulled
                callback(data);
            })
    });
}
/**
 * UPDATE JSON INT  table_interactive_MIS
 * @method updateJson
 * @param {Object} db - This is a instance from sqlite3.Database
 * @param {String} json - string with information from MIS
 * @param {Callback} MIS_id -id json
 */
function updateJson(db, json, MIS_id) {
    let jsonStringify = JSON.stringify(json)
    let sql = "UPDATE table_interactive_MIS SET json=" + "'" + jsonStringify + "'" + " WHERE id=" + "'" + MIS_id + "'";
    db.run(sql, function(err) {
        if (err) {
            return console.error(err.message + " updateJson MIS_services.js");
        }
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!".green)
        console.log("============= A row has been updated " + MIS_id + "=============")
    });
}
/**
 * Use a post and compare json from table_interactive_MIS and post received from MIS
 * @method comapareObjectsInTable
 * @param {Object} db - This is a instance from sqlite3.Database
 * @param {Callback} MIS_id -id of json
 */
function comapareObjectsInTable(db, MIS_id, bodyJson, callback) {
    getMisJsonObject(db, MIS_id, function(data) {
        /*Was aplied some changes in MIS*/
        let jsonParse = JSON.parse(data[0].json);
        if (jsonParse == null || jsonParse.total_events !== bodyJson.total_events) {
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!".green)
            console.log("==============It found a change IN: " + MIS_id + "==========");
            updateJson(db, bodyJson, MIS_id);
            console.log("==============UPDATE " + MIS_id + "==========");
            callback(true)
        } else {
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!".green)
            console.log("==============Same Json--No changes IN: " + MIS_id + "==========");
            callback(false)
        }

    })
}
/*exporting comapareObjectsInTable function*/
module.exports.comapareObjectsInTable = comapareObjectsInTable;
module.exports.getMisJsonObject = getMisJsonObject;