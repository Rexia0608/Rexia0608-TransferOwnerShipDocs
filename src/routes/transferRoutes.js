import express from 'express';
import { 
  listUserFiles, 
  showTransferForm, 
  processTransfer 
} from '../controllers/transferController.js';

const router = express.Router();

router.get('/files', listUserFiles);
router.get('/transfer/:fileId', showTransferForm);
router.post('/transfer', processTransfer);

export default router;