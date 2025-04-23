import express from 'express';
import asyncHandler from 'express-async-handler';
import * as pdfController from '../controller/pdfs.js';
import * as pptController from '../controller/powerpoint.js';

const router = express.Router();

// PDF Dateien
router.post('/addPDF', asyncHandler(pdfController.postPDF));
router.get('/pdf/:name', asyncHandler(pdfController.getPDF));
router.delete('/pdf/:name', asyncHandler(pdfController.deletePDF));

// PDF Notizen
router.post('/PDFnotiz', asyncHandler(pdfController.postNote));
router.get('/PDFnotiz/:pdfID', asyncHandler(pdfController.getNotesByPDF));
router.delete('/note/:noteID', asyncHandler(pdfController.delNote));
router.get('/PDFnote/:noteid', asyncHandler(pdfController.getNoteByID));
router.patch('/note/:noteid', asyncHandler(pdfController.patchNote));

// PowerPoint Dateien
router.get('/pptDateien', asyncHandler(pptController.getPowerPoints));
router.get('/pptDatei/:pptID', asyncHandler(pptController.getPowerPoint));
router.delete('/pptDatei/:pptID', asyncHandler(pptController.delPowerPointFile));

// PowerPoint Notizen
router.get('/pptNotizen', asyncHandler(pptController.getNotes));
router.get('/pptNotizen/:pptID', asyncHandler(pptController.getNotesByPPT));
router.post('/pptNotiz', asyncHandler(pptController.insertPPTNote));

export default router;
