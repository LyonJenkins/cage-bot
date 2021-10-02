const express = require('express')
const app = express()
const port = 3005
import {fetchPlayers} from "../database/controllers/player";
import { CLAN_WL, ADMIN_WL } from "../../config.json"


app.get('/whitelist', (req, res) => {
    fetchPlayers().then(players => {
        let adminList = 'Group=Whitelist:reserve\n\n'
        for(const player of players) {
            adminList += `Admin=${player.steamID}:Whitelist // ID = ${player.discordID} Username = ${player.discordName}\n`
        }
        res.send(adminList)
    })
})

app.get('/adminlist', (req, res) => {
    res.sendFile(ADMIN_WL)
})

app.get('/clanwhitelist', (req, res) => {
    res.sendFile(CLAN_WL)
})

export default {
    execute() {
        app.listen(port, () => {
            console.log(`Whitelist API listening at http://localhost:${port}`)
        })
    }
}
