import express from 'express';
import multer from 'multer';
import { handleFileDownload, handleFileUpload, handleFilesRetrieval } from '../controllers/file.js';

const fileRoute = express.Router();

const upload = multer();

fileRoute
.get('/download', handleFileDownload)
.get('/all', handleFilesRetrieval)
.post('/upload', upload.single('file'), handleFileUpload)

export default fileRoute;