const express = require('express')
const app = express()
const port = 3005
import {fetchPlayers} from "../database/controllers/player";


app.get('/whitelist', (req, res) => {
    fetchPlayers().then(players => {
        let adminList = 'Group=Whitelist:reserve\n\n'
        for(const player of players) {
            adminList += `Admin=${player.steamID}:Whitelist // ${player.discordID}\n`
        }
        res.send(adminList)
    })
})

export default {
    execute() {
        app.listen(port, () => {
            console.log(`Whitelist API listening at http://localhost:${port}`)
        })
    }
}
