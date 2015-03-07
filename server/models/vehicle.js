var helper = require('./helper');

function Vehicle(dbhandler) {
    this.dbhandler = dbhandler;
}

var method = Vehicle.prototype;

method.getVehicleById = function(id, callback) {
    this.dbhandler.getVehicleById(id, function(error, result) {
        if (error) {
            return callback(error);
        }

        if (result.rows.length > 0) {
            callback( null, helper.objKeysToLowerCase(result.rows[0]) );
        }
        else {
            callback( null, null );
        }
    });
};

method.getVehicles = function(startWith, endWith, callback) {
    this.dbhandler.getVehicles(startWith, endWith, function(error, result) {
        if (error) {
            return callback(error);
        }

        if (result.rows.length > 0) {
            callback( null, helper.objsInArrayKeysToLowerCase(result.rows) );
        }
        else {
            callback( null, [] );
        }

    });
};

/* return:
vehicle
----general
--------vin
--------model
--------manufacturer
--------...
----engine_transmission
--------...
----...
*/
method.getVehicleFullInfo = function(id, callback) {
    this.dbhandler.getVehicleFullInfo(id, function(error, result) {
        if (error) {
            return callback(error);
        }

        if (result.rows.length > 0) {
            callback( null, helper.createVehicleStructure(result.rows[0]) );
        }
        else {
            callback( null, null );
        }
        
    });
};


module.exports = Vehicle;
