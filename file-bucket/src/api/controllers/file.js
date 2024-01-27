import { nanoid } from 'nanoid'
import path from 'path';
import fs from 'fs/promises';

async function handleFileUpload(req, res) {
    if (req.body.file) {
        const _id = req.user._id;
        const directoryPath = `uploads/${_id}`;
        
        const directory = path.join(directoryPath);

        const base64Data = req.body.file.url.split(';base64,').pop();
        const uniqueString = nanoid(6);
        const filename = `${uniqueString}${Date.now()}-${req.body.file.name}`;

        try {
            await fs.mkdir(directory, { recursive: true });
            await fs.writeFile(path.join(directory, filename), base64Data, 'base64');

            const files = await fs.readdir(directory);
            return res.status(201).json({ files, uniqueString });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(400).json({ error: 'File upload failed' });
    }
}

async function handleFilesRetrieval(req, res) {
    try {
        const _id = req.user._id;
        const directoryPath = `uploads/${_id}`;
        const directory = path.join(directoryPath);
        
        const files = await fs.readdir(directory) || [];
        return res.status(200).json(files);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function handleFileDownload(req, res) {
    try {
        const _id = req.user._id;
        const directoryPath = `uploads/${_id}`;
        const directory = path.join(directoryPath);
        const targetFile = req.query.image;
        if(!targetFile) {
            return res.status(400).json({ error: 'Missing image parameter' });
        }
        const imagePath = path.resolve(directory, targetFile);
        console.log("PATH: ", imagePath)
        await fs.access(imagePath, fs.constants.F_OK);
        res.sendFile(imagePath);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return res.status(404).json({ error: 'Image not found' });
        }
        console.error('Error downloading image:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export {
    handleFilesRetrieval,
    handleFileUpload,
    handleFileDownload,
}