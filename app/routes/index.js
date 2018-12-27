
let musicStoreRoutes = require('../routes/musicstore_routes');

module.exports = function(app, db) {
    musicStoreRoutes(app,db);
}