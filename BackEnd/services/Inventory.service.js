// Imports
const DataBase = require('./DataBase.service')
const Global = require('./Global.service')

// Main class
class Inventory {
    // constructor
    constructor(...args) {
        this.database = new DataBase()
        this.global = new Global()
        this.args = args
    }

    // function to register inventory entry
    async createEntry() {
        return new Promise((res, rej) => {
            // vars
            const proc = "CALL RegisterInventoryEntry(?,?,?,?,?,?,?,?)"
            const entry = this.args[0]

            const params = [
                entry.producto,
                entry.color,
                entry.talla,
                entry.cantidad,
                entry.costo,
                entry.fecha_ingreso,
                entry.hora_ingreso,
                entry.notas || null
            ]

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) {
                this.database.conection.query(proc, params, (err) => {
                    if (err) {
                        rej({ message: err })
                    } else {
                        setTimeout(() => {
                            res({
                                message: "Entrada de inventario registrada exitosamente",
                                success: true
                            })
                        }, 1000)
                    }
                })
            }

            // close conection 
            this.database.conection.end()
        })
    }

    // function to register multiple entries
    async createMultipleEntries() {
        return new Promise(async (res, rej) => {
            const entries = this.args[0].entries || []
            let successCount = 0
            let errorMessage = null

            if (entries.length === 0) {
                return rej({ message: 'No hay entradas para registrar' })
            }

            try {
                // Process each entry
                for (const entry of entries) {
                    try {
                        await new Promise((resolve, reject) => {
                            const proc = "CALL RegisterInventoryEntry(?,?,?,?,?,?,?,?)"

                            const params = [
                                entry.producto,
                                entry.cantidad,
                                entry.color,
                                entry.talla,
                                entry.costo,
                                entry.fecha_ingreso,
                                entry.hora_ingreso,
                                entry.notas || null
                            ]

                            const db = new DataBase()
                            db.conect()

                            if (db) {
                                db.conection.query(proc, params, (err) => {
                                    if (err) {
                                        reject(err)
                                    } else {
                                        successCount++
                                        resolve()
                                    }
                                })
                            }

                            db.conection.end()
                        })
                    } catch (error) {
                        errorMessage = error.message
                        console.error('Error registrando entrada:', error)
                    }
                }

                res({
                    message: `${successCount} de ${entries.length} entradas registradas exitosamente`,
                    success: true,
                    registeredCount: successCount,
                    totalCount: entries.length
                })
            } catch (error) {
                rej({ message: `Error al procesar las entradas: ${errorMessage || error.message}` })
            }
        })
    }

    // function to get all inventory
    async findAll() {
        return new Promise((res, rej) => {
            const proc = "CALL GetAllInventory()"

            this.database = new DataBase()
            this.database.conect()

            if (this.database) {
                this.database.conection.query(proc, (err, result) => {
                    if (err) {
                        rej({ message: err })
                    } else {
                        res({
                            result: result[0] || [],
                            success: true
                        })
                    }
                })
            }

            this.database.conection.end()
        })
    }

    // function to get all inventory entries
    async findAllEntries() {
        return new Promise((res, rej) => {
            const proc = "CALL GetAllInventoryEntries()"

            this.database = new DataBase()
            this.database.conect()

            if (this.database) {
                this.database.conection.query(proc, (err, result) => {
                    if (err) {
                        rej({ message: err })
                    } else {
                        res({
                            result: result[0] || [],
                            success: true
                        })
                    }
                })
            }

            this.database.conection.end()
        })
    }

    // function to get entries by product
    async findByProduct() {
        return new Promise((res, rej) => {
            const proc = "CALL GetInventoryEntriesByProduct(?)"
            const params = [this.args[0]]

            this.database = new DataBase()
            this.database.conect()

            if (this.database) {
                this.database.conection.query(proc, params, (err, result) => {
                    if (err) {
                        rej({ message: err })
                    } else {
                        res({
                            result: result[0] || [],
                            success: true
                        })
                    }
                })
            }

            this.database.conection.end()
        })
    }

    // function to get entries by date range
    async findByDateRange() {
        return new Promise((res, rej) => {
            const proc = "CALL GetInventoryEntriesByDateRange(?,?)"
            const params = [this.args[0], this.args[1]]

            this.database = new DataBase()
            this.database.conect()

            if (this.database) {
                this.database.conection.query(proc, params, (err, result) => {
                    if (err) {
                        rej({ message: err })
                    } else {
                        res({
                            result: result[0] || [],
                            success: true
                        })
                    }
                })
            }

            this.database.conection.end()
        })
    }

    // function to delete entry
    async delete() {
        return new Promise((res, rej) => {
            const proc = "CALL DeleteInventoryEntry(?)"
            const params = [this.args[0]]

            this.database = new DataBase()
            this.database.conect()

            if (this.database) {
                this.database.conection.query(proc, params, (err) => {
                    if (err) {
                        rej({ message: err })
                    } else {
                        res({
                            message: "Entrada eliminada exitosamente",
                            success: true
                        })
                    }
                })
            }

            this.database.conection.end()
        })
    }
}

module.exports = Inventory
