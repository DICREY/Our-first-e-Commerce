// Imports 
const DataBase = require('./DataBase.service')

// Global Class
class Global {
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

    safeJsonParse(data) {
        if (typeof data === 'string') {
            try {
                return JSON.parse(data)
            } catch (e) {
                console.error('Error parsing JSON:', e)
                return null
            }
        }
        return data; // Ya es un objeto
    }
}

// Export 
module.exports = Global