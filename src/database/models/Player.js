import mongoose from 'mongoose';

const Player = new mongoose.Schema({
	discordID: String,
	steamID: String,
});

export default mongoose.model('Player', Player);
