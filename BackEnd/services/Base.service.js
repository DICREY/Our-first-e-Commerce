const Database = require('./DataBase.service')
const util = require('util')

class Base {
    constructor(...args){
        this.args = args
    }

    // Global function to verify results of querys
    validateResult (result) {
        if (!result || !result[0]){
            throw {message: 'No data found', status: 404}
        }
        return result[0];
    }

    // Global function to verify and return erros after a
    // catch (err)
    handleError (err, statusCode = 500) {
        throw {
            message: err.message || err,
            status: err.status || statusCode
        }
    }

    // Global function to return connection to BD and make querys more simplier
    assistDB () {
        // Instance to BD
        const db = new Database()
        db.conect()
        // Function query, that uses the "util" library to make querys as a promise
        // to reduce lines of codes and make more scalable
        const query = util.promisify(db.connection.query).bind(db.connection)
        return {db , query}
    }
}

module.exports = Base