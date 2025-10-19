/**
 * User Controller
 * Handle user profile operations
 */

const { getAuth, getFirestore } = require('../config/firebase.config');

/**
 * Get user profile
 * GET /api/users/me
 */
async function getProfile(req, res) {
  try {
    const userId = req.user.uid;
    
    const auth = getAuth();
    if (!auth) {
      return res.status(503).json({
        success: false,
        error: 'Service not available'
      });
    }

    const userRecord = await auth.getUser(userId);

    res.status(200).json({
      success: true,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        photoURL: userRecord.photoURL,
        emailVerified: userRecord.emailVerified,
        createdAt: userRecord.metadata.creationTime
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile'
    });
  }
}

/**
 * Update user profile
 * PUT /api/users/me
 */
async function updateProfile(req, res) {
  try {
    const userId = req.user.uid;
    const { displayName, photoURL } = req.body;

    const auth = getAuth();
    if (!auth) {
      return res.status(503).json({
        success: false,
        error: 'Service not available'
      });
    }

    const updateData = {};
    if (displayName) updateData.displayName = displayName;
    if (photoURL) updateData.photoURL = photoURL;

    await auth.updateUser(userId, updateData);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
}

/**
 * Delete user account
 * DELETE /api/users/me
 */
async function deleteAccount(req, res) {
  try {
    const userId = req.user.uid;

    const auth = getAuth();
    if (!auth) {
      return res.status(503).json({
        success: false,
        error: 'Service not available'
      });
    }

    // Delete user from Firebase Auth
    await auth.deleteUser(userId);

    // Delete user data from Firestore
    const db = getFirestore();
    if (db) {
      await db.collection('users').doc(userId).delete();
    }

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete account'
    });
  }
}

module.exports = {
  getProfile,
  updateProfile,
  deleteAccount
};
