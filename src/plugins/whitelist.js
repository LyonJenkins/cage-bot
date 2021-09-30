import { WHITELIST_CHANNEL, WHITELIST_ROLE } from '../../config.json'
import { getSteamUser } from '../utilities'
import { newPlayer, fetchPlayers, removePlayer }  from "../database/controllers/player";
import { Player } from '../database/models';
import { connect } from '../database/main';

export default {
    execute(client) {
        client.on('messageCreate', message => {
            if(message.channel.id === WHITELIST_CHANNEL && message.author.id !== client.user.id) {
                addToWhitelist(message);
                delay(5000).then(() => {
                    message.delete()
                })
            }
        });
        client.on('guildMemberUpdate', (oldMember, newMember)  => {
            let changedRoles = [];
            const oldRoles = oldMember._roles;
            const newRoles = newMember._roles;
            for(const role of oldRoles) {
                if(newRoles.indexOf(role) === -1) {
                    changedRoles.push({
                        role,
                        updateType: 'remove',
                    })
                }
            }
            for(const role of newRoles) {
                if(oldRoles.indexOf(role) === -1) {
                    changedRoles.push({
                        role,
                        updateType: 'add',
                    })
                }
            }
            for(const role of changedRoles) {
                if(role.role === WHITELIST_ROLE && role.updateType === 'remove') {
                    removeMemberFromWhitelist(oldMember);
                }
            }
        });
        client.on('guildMemberRemove', member => {
            removeMemberFromWhitelist(member);
        });
    }
}

async function addToWhitelist(message) {
    const steamUser = await getSteamUser(message.content)
    if(steamUser == null) {
        message.reply('wrong input or that Steam user does not exist.').then(reply => {
            setTimeout(() => reply.delete(), 5000)
        })
    } else {
        const players = await fetchPlayers();
        const foundPlayerDiscordID = players.find(player => player.discordID === message.author.id)
        if(foundPlayerDiscordID) {
            message.reply('you already have a Steam ID linked with your Discord account.').then(reply => {
                setTimeout(() => reply.delete(), 5000)
            })
        } else {
            const foundPlayerSteamID = players.find(player => player.steamID === steamUser.steamID)
            if(foundPlayerSteamID) {
                message.reply('that SteamID is already in use.').then(reply => {
                    setTimeout(() => reply.delete(), 5000)
                })
            } else {
                message.reply('linked Steam user ${steamUser.nickname} with your account.').then(reply => {
                    setTimeout(() => reply.delete(), 5000)
                })
                const newPlayerToAdd = {discordID: message.author.id, steamID: steamUser.steamID}
                newPlayer(newPlayerToAdd)
            }
        }
    }
}

function removeMemberFromWhitelist(discordGuildMember) {
    fetchPlayers().then(players => {
        const isPlayerInWhitelist = players.find(player => player.discordID === discordGuildMember.user.id)
        if(isPlayerInWhitelist) {
            console.log(`Removed ${discordGuildMember.user.username} from the Whitelist`)
            removePlayer({discordID: discordGuildMember.user.id})
        } else {
            console.log(`Failed attempt to remove ${discordGuildMember.user.username} from the whitelist`)
        }
    })
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
