import mongoose from 'mongoose';

export function connect(uri, callback) {
    mongoose.connect('mongodb://localhost:27017/cagedb', {useNewUrlParser: true, useUnifiedTopology: true, });
}
