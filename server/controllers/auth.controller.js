/**
 * Authentication Controller
 * Handle user authentication with Firebase
 */

const { getAuth } = require('../config/firebase.config');
const Joi = require('joi');

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  displayName: Joi.string().min(2).max(50).optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

/**
 * Register new user
 * POST /api/auth/register
 */
async function register(req, res) {
  try {
    // Validate input
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const auth = getAuth();
    if (!auth) {
      return res.status(503).json({
        success: false,
        error: 'Authentication service not available',
        message: 'Firebase Auth is not configured'
      });
    }

    const { email, password, displayName } = value;

    // Create user in Firebase
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: displayName || email.split('@')[0]
    });

    console.log(`✅ User created: ${userRecord.uid}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 'auth/email-already-exists') {
      return res.status(409).json({
        success: false,
        error: 'Email already exists'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Registration failed'
    });
  }
}

/**
 * Login user
 * POST /api/auth/login
 * Note: Firebase Admin SDK doesn't handle client-side login.
 * This endpoint is a placeholder. Real login should happen on client-side.
 */
async function login(req, res) {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    // In a real scenario, client-side Firebase SDK handles login
    // Server-side only verifies tokens
    res.status(200).json({
      success: true,
      message: 'Please use Firebase Auth SDK on client-side for login',
      info: 'Send the ID token to /api/auth/verify endpoint'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
}

/**
 * Verify Firebase ID token
 * POST /api/auth/verify
 */
async function verifyToken(req, res) {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Token is required'
      });
    }

    const auth = getAuth();
    if (!auth) {
      return res.status(503).json({
        success: false,
        error: 'Authentication service not available'
      });
    }

    // Verify the token
    const decodedToken = await auth.verifyIdToken(token);

    res.status(200).json({
      success: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
}

/**
 * Logout user
 * POST /api/auth/logout
 */
async function logout(req, res) {
  try {
    // Firebase handles logout on client-side
    // Server can revoke refresh tokens if needed
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Logout failed'
    });
  }
}

module.exports = {
  register,
  login,
  verifyToken,
  logout
};
