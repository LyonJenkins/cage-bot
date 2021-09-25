import { STEAM_API_KEY } from '../../config';

const SteamUser = require('steamapi-node');
const got = require('got');
const steam = new SteamUser(STEAM_API_KEY);
const idRegex = /^\d{17}$/;

export default async function getSteamUser(input) {
    let steamID = input;
    if(validURL(steamID)) {
        const id = await get64ID(steamID);
        if(id.response.steamid) {
            return await verifyUser(id.response.steamid);
        } else {
            return undefined;
        }
    } else {
        return await verifyUser(steamID);
    }
}

async function verifyUser(steamID) {
    if(!idRegex.test(steamID)) return undefined;
    return await steam.users.getUserSummary(steamID);
}

function validURL(str) {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}

async function get64ID(url) {
    let vanityUrl = url.split('/');
    if (vanityUrl.indexOf('id') !== -1) {
        vanityUrl = vanityUrl[vanityUrl.indexOf('id') + 1];
    }
    if (vanityUrl.indexOf('profiles') !== -1) {
        const id = vanityUrl[vanityUrl.indexOf('profiles') + 1];
        return {response: {steamid: id}};
    }
    try {
        const response = await got(`http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${steamAPIkey}&vanityurl=${vanityUrl}`);
        return JSON.parse(response.body);
    } catch (error) {
        console.log(error.response.body);
    }
}
