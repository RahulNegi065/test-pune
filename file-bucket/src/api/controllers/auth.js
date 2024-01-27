import User from '../models/user.js';
import { setUser } from '../services/auth.js';

async function handleUserAtHomepage(req, res) {
  console.log('in auth routes');
  const username = req.user.username;
  const user = await User.findOne({ username });
  console.log("User", user);
  if(!user) return res.status(401).json({ error: "User not found!" });
  return res.status(200).json(user);
}

async function handleUserRegistration(req, res) {
  try {
    const body = req.body;
    if(!body.username || !body.password) return res.status(400).json({ error: "Username & Password are required" });

    await User.create({
      username: body.username,
      password: body.password
    });
    return res.status(201).json({ msg: "User created successfully!" });
  } catch (error) {
    console.log("Error while creating user: ", error);
    if (error.code === 11000) {
      return res.status(400).json({ error: "Username is already taken" });
    } else return res.status(400).json({ error: error.message });
  }
}

async function handleUserLogin(req, res) {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if(!user) return res.status(401).json({ error: "Invalid username or password" });

  const token = setUser(user);
  return res.status(200).json({ token });
}

export {
  handleUserAtHomepage,
  handleUserRegistration,
  handleUserLogin,
}