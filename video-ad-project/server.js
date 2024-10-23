const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to serve static files (videos, admin panel, and views)
app.use(express.static('public'));
app.use('/admin', express.static(path.join(__dirname, 'admin'))); // Serve admin files
app.use('/views', express.static(path.join(__dirname, 'views'))); // Serve views files

// Middleware to parse JSON bodies
app.use(express.json());

// Video storage location
const videoDirectory = path.join(__dirname, 'public/videos');
if (!fs.existsSync(videoDirectory)) {
    fs.mkdirSync(videoDirectory, { recursive: true });
}

// Multer setup for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/videos');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

// API to upload a video
app.post('/upload-video', upload.single('video'), (req, res) => {
    const filename = req.file.originalname;
    fs.writeFileSync('current-video.json', JSON.stringify({ filename }));
    res.status(200).send('Video uploaded successfully.');
});

// API to get the current video
app.get('/current-video', (req, res) => {
    const currentVideo = JSON.parse(fs.readFileSync('current-video.json', 'utf8'));
    res.json(currentVideo);
});

// Serve video files
app.use('/videos', express.static(path.join(__dirname, 'public/videos')));

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
