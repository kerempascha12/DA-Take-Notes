import express from 'express';
import * as controller from '../controller/groups.js';
import { redirectLogin } from '../controller/authentication.js';

const router = express.Router();

// Gruppe erstellen
router.post('/', redirectLogin, controller.createGroup);

// Gruppe beitreten (NEU: über randomCode, nicht groupId!)
router.post('/join/:randomCode', redirectLogin, controller.joinGroup);

// Mitglieder einer Gruppe abfragen
router.get('/:groupId/members', redirectLogin, controller.getGroupMembers);

// Eigene Gruppen holen
router.get('/', redirectLogin, controller.getGroups);

// Gruppe löschen
router.delete('/:groupId', redirectLogin, controller.deleteGroup);

export default router;
