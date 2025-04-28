import { nanoid } from 'nanoid'; // 🚀 nanoid hinzufügen
import * as model from '../model/groups.js';

/* === Gruppe erstellen === */
const createGroup = async (req, res) => {
  try {
    const { name, videoId } = req.body;
    const ownerId = req.session.userId;

    if (!name || !ownerId) {
      return res.status(400).json({ error: 'Group name and owner are required' });
    }

    const randomCode = nanoid(12); // 12 Zeichen langen Code generieren

    const { rows } = await model.createGroup(name, ownerId, videoId, randomCode);
    return res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating group:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/* === Gruppe beitreten === */
const joinGroup = async (req, res) => {
  try {
    const { randomCode } = req.params;
    const { userId } = req.session; // schön gemacht!

    if (!randomCode || !userId) {
      return res.status(400).json({ error: 'Random code and user ID are required' });
    }

    const { rows, rowCount } = await model.findGroupByRandomCode(randomCode);

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const groupId = rows[0].id;
    await model.addMemberToGroup(groupId, userId);
    return res.status(201).json({ message: 'Joined group successfully' });
  } catch (error) {
    console.error('Error joining group:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/* === Mitglieder einer Gruppe holen === */
const getGroupMembers = async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!groupId) {
      return res.status(400).json({ error: 'Group ID is required' });
    }

    const { rows } = await model.getMembersByGroupId(groupId);
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error getting group members:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/* === Gruppe löschen === */
const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const ownerId = req.session.userId;

    if (!groupId || !ownerId) {
      return res.status(400).json({ error: 'Group ID and owner ID are required' });
    }

    const { rows } = await model.findGroupById(groupId);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Group not found' });
    }

    if (rows[0].owner_id !== ownerId) {
      return res.status(403).json({ error: 'You are not allowed to delete this group' });
    }

    await model.deleteGroup(groupId);
    return res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Error deleting group:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/* === Alle Gruppen eines Users holen === */
const getGroups = async (req, res) => {
  try {
    const { userId } = req.session;
    const { rows } = await model.getGroupsByUserId(userId);
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching groups:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { createGroup, joinGroup, getGroupMembers, deleteGroup, getGroups };
