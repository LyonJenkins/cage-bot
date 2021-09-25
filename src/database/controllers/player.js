import { Player } from '../models';
import { connect } from '../main';

export async function fetchPlayers(key) {
	connect();
	if(!key) key = {};
	return await Player.find(key).exec()
}

export function newPlayer(player) {
	connect();
	const newPlayer = new Player(player);
	newPlayer.save().then(() => {
		console.log('New player added');
	});
}

export function updatePlayer(id, data) {
	connect();
	Player.findByIdAndUpdate(id, data, (err, player) => {
		if(err) console.log(err);
		console.log('Updated player');
	});
}

export function removePlayer(key) {
	connect();
	Player.findOneAndDelete(key, (err, player) => {
		if(err) console.log(err);
		console.log('Removed player')
	})
}
