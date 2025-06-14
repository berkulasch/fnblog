const express = require('express');
const cors = require('cors');
const app = express();
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const Post = require('./models/Post');
const fs = require('fs');


const multer = require('multer');


const uploadMiddleware = multer({ dest: 'uploads/' }); // Specify the directory to save uploaded files


const secret = 'dasmokfoekdlshgvifjcdkx,jcfimd'
const salt = bcrypt.genSaltSync(10);


app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000'], 
}));

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));
app.get('/', (req, res) => {
    res.send('Backend is running');
});


mongoose.connect('mongodb+srv://ulassberk:admin@cluster0.ta9te.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));;

app.post('/register', async(req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const hashedPassword = bcrypt.hashSync(password, salt);
        const userDoc = await User.create({
            username,
            password: hashedPassword,
        });
        res.json(userDoc);
    } catch (e) {
        if (e.code === 11000) { // Duplicate key error for unique fields
            return res.status(400).json({ message: 'Username already exists' });
        }
        res.status(500).json(e);
    }
});



app.post('/login', async(req, res) => {
    const { username, password } = req.body;

    // Find user by username
    const userDoc = await User.findOne({ username });

    // Check if user exists
    if (!userDoc) {
        return res.status(400).json({ error: 'User not found' });
    }

    // Compare password with hashed password stored in the database
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
        // Create JWT token
        jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
            if (err) throw err;

            // Set cookie with JWT token
            res.cookie('token', token, {
                httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
                secure: process.env.NODE_ENV === 'production', // Set to true in production for HTTPS
                sameSite: 'strict', // Add more security for the cookie
            }).json({ message: 'Login successful' });
        });
    } else {
        // Invalid password
        return res.status(400).json({ error: 'Invalid password' });
    }
});

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) throw err;
        res.json(info);
    });

});

app.post('/logout', (req,res) => {
    res.cookie('token', '').json('ok');
})


app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    console.log('Received a POST request to /post');

    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { title, summary, content } = req.body;

        // Check if a similar post already exists
        const existingPost = await Post.findOne({ title, summary, content });
        if (existingPost) {
            return res.status(400).json({ message: 'Duplicate post detected' });
        }

        try {
            const postDoc = await Post.create({
                title,
                summary,
                content,
                cover: newPath,
                author: info.id,
            });
            console.log('Post created:', postDoc);
            res.json(postDoc);
        } catch (err) {
            res.status(500).json({ message: 'Error creating post', error: err });
        }
    });
});



app.get('/post', async (req, res) => {
    res.json(await Post.find()
        .populate('author', ['username'])
        .sort({ createdAt: -1 })
        .limit(20)
    );
});

app.get('/post/:id', async (req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
  })

app.listen(5000);

//mongodb+srv://ulassberk:<db_password>@cluster0.ta9te.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0