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
    async SellestProducts() {
        return new Promise((res,rej) => {
            // vars
            const proc = "CALL SellestProducts();"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc,(err,result) => {
                if(err) rej({ message: err })
                if(!result || !result[0][0]) rej({
                    message: "Not found",
                    status: 404
                })
                const resOne = this.format(result[0],'colors',['nom_col','hex_col'])
                const lastRes = this.iterar(resOne,'sizes')
                setTimeout(() => {
                    res({
                        message: "Info found",
                        result: lastRes
                    })
                },1000)
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
                if(err) rej({ message: err })
                if(!result || !result[0][0]) rej({
                    message: "Not found",
                    status: 404
                })
                setTimeout(() => {
                    res({
                        message: "Info found",
                        result: result
                    })
                },1000)
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
                if(err) rej({ message: err })
                if(!result || !result[0][0]) rej({
                    message: "Not found",
                    status: 404
                })
                setTimeout(() => {
                    res({
                        message: "Info found",
                        result: result
                    })
                },1000)
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
                if(err) rej({ message: err })
                if(!result || !result[0][0]) rej({
                    message: "Not found",
                    status: 404
                })
                setTimeout(() => {
                    res({
                        message: "Info found",
                        result: result
                    })
                },1000)
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
                if(err) rej({ message: err })
                if(!result || !result[0][0]) rej({
                    message: "Not found",
                    status: 404
                })
                setTimeout(() => {
                    res({
                        message: "Info found",
                        result: result
                    })
                },1000)
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
                if(err) rej({ message: err })
                if(!result || !result[0][0]) rej({
                    message: "Not found",
                    status: 404
                })
                setTimeout(() => {
                    res({
                        message: "Info found",
                        result: result
                    })
                },1000)
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
                if(err) rej({ message: err })
                if(!result || !result[0][0]) rej({
                    message: "Not found",
                    status: 404
                })
                setTimeout(() => {
                    res({
                        message: "Info found",
                        result: result
                    })
                },1000)
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
                if(err) rej({ message: err })
                if(!result || !result[0][0]) rej({
                    message: "Not found",
                    status: 404
                })
                setTimeout(() => {
                    res({
                        message: "Info found",
                        result: result
                    })
                },1000)
            })

            // close conection 
            this.database.conection.end()
        })
    }
}

// Export 
module.exports = Stats