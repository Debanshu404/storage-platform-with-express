import express from 'express'
import path from 'node:path'
import { writeFile, readFile } from 'fs/promises';
import crypto from 'node:crypto';

const router = express.Router();

// ❌ DON'T read at top level - it only reads once!
// const users = JSON.parse(await readFile('./userdb.json', 'utf-8'));
// const folderitems = JSON.parse(await readFile('./folderdb.json', 'utf-8'));

// ✅ Helper functions to read fresh data each time
async function getUsers() {
  return JSON.parse(await readFile('./userdb.json', 'utf-8'));
}

async function getFolderItems() {
  return JSON.parse(await readFile('./folderdb.json', 'utf-8'));
}

router.post('/register', async (req, res) => {
  try {
    const users = await getUsers(); // ✅ Read fresh data
    const folderitems = await getFolderItems();
    
    const { name, email, password } = req.body;
    const founduser = users.find((usr) => usr.email === email);
    
    if (founduser) {
      console.log("error duplicate email used");
      return res.status(409).json({ 
        message: "User already exist", 
        error: "try with a new email email already exist" 
      });
    }
    
    const userId = crypto.randomUUID();
    const dirId = crypto.randomUUID();
    
    folderitems.push({
      "id": dirId, // ✅ IMPORTANT: Use dirId here, not userId
      "name": `root-${email}`,
      "parentdir": null,
      "filee": [],
      "directories": [],
      "isRoot": true,
      "createdAt": new Date().toISOString(),
      "updatedAt": new Date().toISOString(),
      "permissions": "rwxr-xr-x",
      "owner": userId,
      "size": 0,
      "metadata": {
        "tags": [],
        "description": "Root directory"
      }
    });
    
    users.push({
      "id": userId,
      name,
      email,
      password,
      "rootdirid": dirId
    });
    
    await writeFile('./userdb.json', JSON.stringify(users, null, 2));
    await writeFile('./folderdb.json', JSON.stringify(folderitems, null, 2));
    
    console.log(`user ${name} created successfully`);
    res.status(201).json({ 
      message: `user ${name} created successfully`, 
      type: "success" 
    });
    
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "error occurred", type: "error" });
  }
});

router.post('/login', async (req, res) => {
  try {
    console.log("hello from login");
    const users = await getUsers(); // ✅ Read fresh data
    
    const { email, password } = req.body;
    const user = users.find((user) => user.email === email);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid Credentials' });
    }
    
    console.log("Setting cookie for user:", user.id);
    
    // ✅ Set cookie - this looks correct!
    res.cookie('uid', user.id, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 604800000, // 7 days
      path: '/'
      // NO secure flag for localhost
    });
    
    res.status(200).json({ 
      message: 'logged in successfully',
      userId: user.id // Optional: send user info back
    });
    
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;