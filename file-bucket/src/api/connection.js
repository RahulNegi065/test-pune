import mongoose from "mongoose";

async function connectMongo(uri) {
    return mongoose.connect(uri, {dbName:'mobigic'});
}

export default connectMongo;