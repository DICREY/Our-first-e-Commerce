// Librarys 
const { Router } = require('express')

// Imports 
// const { authenticateJWT } = require('../middleware/validator.handler')
const Stats = require('../services/Stats.service')

// Vars 
const Route = Router()

Route.post('/api/track/session', async (req, res) => {
    try {
        // conect to database
        this.database = new DataBase()
        this.database.conect()
    
        // verify conection and call procedure
        const { sessionId, userId, ip, userAgent, device, browser, os, referrer, country, city } = req.body;
        
        if (this.database) this.database.conection.query(proc,(err,result) => {
            if(err) rej({ message: err })
        })
        const [existing] = await pool.query(
            [sessionId]
        );
        
        if (existing.length === 0) {
            await pool.query(
                `INSERT INTO sessions 
                (id_ses,usu_id_ses,dir_ip_ses,user_agent_ses,device_type_ses,browser_ses,os_ses,ref_ses,pai_ses,cit_ses)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [sessionId, userId, ip, userAgent, device, browser, os, referrer, country, city]
            );
        } else {
            await pool.query(
                'UPDATE sessions SET last_activity = CURRENT_TIMESTAMP WHERE id_ses = ?',
                [sessionId]
            );
        }
        
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error tracking session:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Endpoint para registrar una visita a página
Route.post('/api/track/pageview', async (req, res) => {
    try {
        const { sessionId, pageUrl, pageTitle } = req.body;
        
        await pool.query(
            `INSERT INTO page_views 
            (id_ses_vie, url_pag_vie, tit_pag_vie) 
            VALUES (?, ?, ?)`,
            [sessionId, pageUrl, pageTitle]
        );
        
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error tracking page view:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Export 
module.exports = Route