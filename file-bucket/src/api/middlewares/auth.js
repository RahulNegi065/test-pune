import { getUser } from '../services/auth.js';

function getUserAuthState(req, res, next) {
    req.user = null;
    const authHeaderValue = req.headers["authorization"];
    if(!authHeaderValue || !authHeaderValue.startsWith('Bearer')) {   
        return res.status(401).json({ msg: "New User!" });
    }
    
    const token = authHeaderValue.split('Bearer ')[1];
    const user = getUser(token);
    if(!user) return res.status(401).json({ msg: "New User!" });
    req.user = user;
    next();
}

export {
    getUserAuthState,
}