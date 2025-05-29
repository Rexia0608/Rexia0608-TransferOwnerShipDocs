import { drive } from '../config/googleAuth.js';

export const listFiles = async (auth) => {
  const res = await drive.files.list({
    auth,
    pageSize: 10,
    fields: 'files(id, name, mimeType, owners)',
    q: "mimeType != 'application/vnd.google-apps.folder'"
  });
  return res.data.files;
};

export const transferOwnership = async (auth, fileId, newOwnerEmail) => {
  try {
    // First add the new owner
    await drive.permissions.create({
      auth,
      fileId,
      requestBody: {
        role: 'owner',
        type: 'user',
        emailAddress: newOwnerEmail,
        transferOwnership: true
      },
      sendNotificationEmail: true
    });

    // Then remove the original owner
    const permissions = await drive.permissions.list({
      auth,
      fileId,
      fields: 'permissions(id, emailAddress, role)'
    });

    const originalOwnerPermission = permissions.data.permissions.find(
      p => p.role === 'owner' && p.emailAddress !== newOwnerEmail
    );

    if (originalOwnerPermission) {
      await drive.permissions.delete({
        auth,
        fileId,
        permissionId: originalOwnerPermission.id
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error transferring ownership:', error);
    return { success: false, error: error.message };
  }
};