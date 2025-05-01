import express from 'express';
import asyncHandler from 'express-async-handler';
import * as pdfController from '../controller/pdfs.js';
import * as pptController from '../controller/powerpoint.js';
import * as ytController from '../controller/youtube.js';

const router = express.Router();

// PDF Dateien
router.post('/addPDF', asyncHandler(pdfController.postPDF));
router.get('/pdf/:name', asyncHandler(pdfController.getPDF));
router.delete('/pdf/:name', asyncHandler(pdfController.deletePDF));
router.get('/pdfID/:id', asyncHandler(pdfController.getPDFbyID));

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
router.post('/pptDatei', asyncHandler(pptController.postPowerPoint));
router.patch('/pptDatei/:pptID', asyncHandler(pptController.renamePowerPoint));

// PowerPoint Notizen
router.get('/pptNotizen', asyncHandler(pptController.getNotes));
router.get('/pptNotizen/:pptID', asyncHandler(pptController.getNotesByPPT));
router.get('/pptNotiz/:nid', asyncHandler(pptController.getNoteByID));
router.delete('/pptNotiz/:nid', asyncHandler(pptController.delNote));
router.post('/pptNotiz', asyncHandler(pptController.insertPPTNote));
router.patch('/pptNotiz/:nid', asyncHandler(pptController.patchNote));

// YouTube Video
router.get('/video/:id', asyncHandler(ytController.getVideoByID));

// YouTube Notizen
router.get('/ytNotes/:vid', asyncHandler(ytController.getNotesByVideoID));
router.post('/ytNote', asyncHandler(ytController.postYTnote));
router.get('/ytNote/:nid', asyncHandler(ytController.getNoteByID));
router.delete('/ytNote/:nid', asyncHandler(ytController.delNote));
router.patch('/ytNote/:nid', asyncHandler(ytController.patchNote));

export default router;
