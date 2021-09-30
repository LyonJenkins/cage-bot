import mongoose from 'mongoose';

const Player = new mongoose.Schema({
	discordID: String,
	steamID: String,
	discordName: String
});

export default mongoose.model('Player', Player);
