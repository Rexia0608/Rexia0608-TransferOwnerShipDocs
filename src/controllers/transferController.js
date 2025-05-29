import { oauth2Client } from '../config/googleAuth.js';
import { listFiles, transferOwnership } from '../utils/driveUtils.js';

export const listUserFiles = async (req, res) => {
  if (!req.session.tokens) {
    return res.redirect('/auth/google');
  }

  try {
    oauth2Client.setCredentials(req.session.tokens);
    const files = await listFiles(oauth2Client);
    res.render('files', { files });
  } catch (error) {
    console.error('Error listing files:', error);
    res.redirect('/?error=listing_files');
  }
};

export const showTransferForm = (req, res) => {
  const { fileId } = req.params;
  res.render('transfer', { fileId });
};

export const processTransfer = async (req, res) => {
  const { fileId, newOwnerEmail } = req.body;
  
  if (!req.session.tokens) {
    return res.redirect('/auth/google');
  }

  try {
    oauth2Client.setCredentials(req.session.tokens);
    const result = await transferOwnership(oauth2Client, fileId, newOwnerEmail);
    
    if (result.success) {
      res.render('transfer-success', { fileId, newOwnerEmail });
    } else {
      res.render('transfer-error', { error: result.error });
    }
  } catch (error) {
    console.error('Error processing transfer:', error);
    res.render('transfer-error', { error: error.message });
  }
};