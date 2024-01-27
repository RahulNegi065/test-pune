import jwt from 'jsonwebtoken';
const secret = "Mobigic$411045"

function setUser(user) {
    return jwt.sign({
        _id: user._id,
        username: user.username,
    }, secret);
}

function getUser(token) {
    if(!token) return null;
    return jwt.verify(token, secret);
}

export {
    setUser,
    getUser,
}