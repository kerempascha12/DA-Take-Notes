import express from 'express';
import asyncHandler from 'express-async-handler';
import * as controller from '../controller/pdfs.js';

const router = express.Router();

// PDF Dateien
router.post('/addPDF', asyncHandler(controller.postPDF));
router.get('/pdf/:name', asyncHandler(controller.getPDF));
router.delete('/pdf/:name', asyncHandler(controller.deletePDF));

// PDF Notizen
router.post('/PDFnotiz', asyncHandler(controller.postNote));
router.get('/PDFnotiz/:pdfID', asyncHandler(controller.getNotesByPDF));
router.delete('/note/:noteID', asyncHandler(controller.delNote));
router.get('/PDFnote/:noteid', asyncHandler(controller.getNoteByID));
router.patch('/note/:noteid', asyncHandler(controller.patchNote));

export default router;
