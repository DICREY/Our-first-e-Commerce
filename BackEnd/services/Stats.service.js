// Imports 
const DataBase = require('./DataBase.service')

// Stats Class
class Stats {
    // constructor
    constructor(...args) {
        this.database = new DataBase()
        this.args = args
    }

    headerI = (headers = [], data = []) => {
        const result = {}
        headers.forEach((header, index) => {
            result[header] = data[index] !== undefined ? data[index] : null;
        })
        return result
    }

    format = (datas = [], subKey = '', headers = []) => {
        const results = datas.map(data => {
            const list = data[subKey]?.split("---")
            .map(item => {
                const subList = item.split(";")
                return this.headerI(headers,subList)
            })
            return {
                ...data,
                [subKey]: list
            }
        })
        return results
    }

    iterar = (datas = [], key = '') => {
        return datas.map(data => {
            const value = data[key];
            const arr = typeof value === 'string'
                ? value.split('---').map(item => item.trim()).filter(item => item.length > 0)
                : [];
            return { ...data, [key]: arr };
        });
    }

    // function to find sellest products
    async StatsGeneral() {
        return new Promise((res,rej) => {
            // vars
            const proc = "CALL StatsGeneral();"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc,(err,result) => {
                if(err) {
                    rej({ message: err })
                } else if (result) {
                    setTimeout(() => {
                        res({
                            message: "Info found",
                            result: result?.[0]?.[0]
                        })
                    },1000)
                } else rej({ message: 'Error interno', status: 500 })
            })

            // close conection 
            this.database.conection.end()
        })
    }

    // function to find sellest products
    async SellestProducts() {
        return new Promise((res,rej) => {
            // vars
            const proc = "CALL SellestProducts();"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc,(err,result) => {
                if(err) {
                    rej({ message: err })
                } else if (result) {
                    const resOne = this.format(result[0],'colors',['nom_col','hex_col','nom_img','url_img'])
                    const lastRes = this.iterar(resOne,'sizes')
                    const lastLastRes = this.format(lastRes, 'offers', [
                        'id_ofe', 'nom_ofe', 'des_ofe', 'dur_ofe', 'fec_ini_ofe', 'fec_fin_ofe', 'por_des_ofe', 'created_at', 'updated_at'
                    ])
                    setTimeout(() => {
                        res({
                            message: "Info found",
                            result: lastLastRes
                        })
                    },1000)
                } else rej({ message: 'Error interno', status: 500 })
            })

            // close conection 
            this.database.conection.end()
        })
    }

    // function to find Stats Sales Today
    async TodaySales() {
        return new Promise((res,rej) => {
            // vars
            const proc = "CALL TodaySales();"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc,(err,result) => {
                if(err) {
                    rej({ message: err })
                } else if (result) {
                    setTimeout(() => {
                        res({
                            message: "Info found",
                            result: result[0]
                        })
                    },1000)
                } else rej({ message: 'Error interno', status: 500 })
            })

            // close conection 
            this.database.conection.end()
        })
    }

    // function to find Sales Per Day
    async SalesPerDay() {
        return new Promise((res,rej) => {
            // vars
            const proc = "CALL SalesPerDay();"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc,(err,result) => {
                if(err) {
                    rej({ message: err })
                } else if (result) {
                    setTimeout(() => {
                        res({
                            message: "Info found",
                            result: result[0]
                        })
                    },1000)
                } else rej({ message: 'Error interno', status: 500 })
            })

            // close conection 
            this.database.conection.end()
        })
    }

    // function to find Weekly Sales
    async WeeklySales() {
        return new Promise((res,rej) => {
            // vars
            const proc = "CALL WeeklySales();"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc,(err,result) => {
                if(err) {
                    rej({ message: err })
                } else if (result) {
                    setTimeout(() => {
                        res({
                            message: "Info found",
                            result: result[0]
                        })
                    },1000)
                } else rej({ message: 'Error interno', status: 500 })
            })

            // close conection 
            this.database.conection.end()
        })
    }

    // function to find Monthly Sales
    async MonthlySales() {
        return new Promise((res,rej) => {
            // vars
            const proc = "CALL MonthlySales();"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc,(err,result) => {
                if(err) {
                    rej({ message: err })
                } else if (result) {
                    setTimeout(() => {
                        res({
                            message: "Info found",
                            result: result[0]
                        })
                    },1000)
                } else rej({ message: 'Error interno', status: 500 })
            })

            // close conection 
            this.database.conection.end()
        })
    }

    // function to find Annual sales
    async AnnualSales() {
        return new Promise((res,rej) => {
            // vars
            const proc = "CALL AnnualSales();"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc,(err,result) => {
                if(err) {
                    rej({ message: err })
                } else if (result) {
                    setTimeout(() => {
                        res({
                            message: "Info found",
                            result: result
                        })
                    },1000)
                } else rej({ message: 'Error interno', status: 500 })
            })

            // close conection 
            this.database.conection.end()
        })
    }

    // function to find Major Buyers
    async MajorBuyers() {
        return new Promise((res,rej) => {
            // vars
            const proc = "CALL MajorBuyers();"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc,(err,result) => {
                if(err) {
                    rej({ message: err })
                } else if (result) {
                    setTimeout(() => {
                        res({
                            message: "Info found",
                            result: result
                        })
                    },1000)
                } else rej({ message: 'Error interno', status: 500 })
            })

            // close conection 
            this.database.conection.end()
        })
    }

    // function to find frequency per client
    async FrequencyPerClient() {
        return new Promise((res,rej) => {
            // vars
            const proc = "CALL FrequencyPerClient();"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc,(err,result) => {
                if(err) {
                    rej({ message: err })
                } else if (result) {
                    setTimeout(() => {
                        res({
                            message: "Info found",
                            result: result
                        })
                    },1000)
                } else rej({ message: 'Error interno', status: 500 })
            })

            // close conection 
            this.database.conection.end()
        })
    }

    // function to find performance per categorie
    async PerformancePerCategorie() {
        return new Promise((res,rej) => {
            // vars
            const proc = "CALL PerformancePerCategorie();"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc,(err,result) => {
                if(err) {
                    rej({ message: err })
                } else if (result) {
                    setTimeout(() => {
                        res({
                            message: "Info found",
                            result: result
                        })
                    },1000)
                } else rej({ message: 'Error interno', status: 500 })
            })

            // close conection 
            this.database.conection.end()
        })
    }

    // function to find Products With Low Stock
    async ProductsWithLowStock() {
        return new Promise((res,rej) => {
            // vars
            const proc = "CALL ProductsWithLowStock();"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc,(err,result) => {
                if(err) {
                    rej({ message: err })
                } else if (result) {
                    setTimeout(() => {
                        res({
                            message: "Info found",
                            result: result
                        })
                    },1000)
                } else rej({ message: 'Error interno', status: 500 })
            })

            // close conection 
            this.database.conection.end()
        })
    }

    // function to find Sales Summary
    async SalesSummary() {
        return new Promise((res,rej) => {
            // vars
            const proc = "CALL SalesSummary();"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc,(err,result) => {
                if(err) {
                    rej({ message: err })
                } else if (result) {
                    setTimeout(() => {
                        res({
                            message: "Info found",
                            result: result[0]
                        })
                    },1000)
                } else rej({ message: 'Error interno', status: 500 })
            })

            // close conection 
            this.database.conection.end()
        })
    }

    // function to find Sales Per Month
    async SalesPerMonth() {
        return new Promise((res,rej) => {
            // vars
            const proc = "CALL SalesPerMonth();"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc,(err,result) => {
                if(err) {
                    rej({ message: err })
                } else if (result) {
                    setTimeout(() => {
                        res({
                            message: "Info found",
                            result: result
                        })
                    },1000)
                } else rej({ message: 'Error interno', status: 500 })
            })

            // close conection 
            this.database.conection.end()
        })
    }
    // function to find Year On Year Comparison
    async YearOnYearComparison() {
        return new Promise((res,rej) => {
            // vars
            const proc = "CALL YearOnYearComparison();"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc,(err,result) => {
                if(err) {
                    rej({ message: err })
                } else if (result) {
                    setTimeout(() => {
                        res({
                            message: "Info found",
                            result: result
                        })
                    },1000)
                } else rej({ message: 'Error interno', status: 500 })
            })

            // close conection 
            this.database.conection.end()
        })
    }
}

// Export 
module.exports = Stats