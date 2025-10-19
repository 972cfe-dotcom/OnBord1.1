/**
 * Calculator Controller
 * Business logic for calculator operations
 */

const { getFirestore } = require('../config/firebase.config');
const Joi = require('joi');

// Validation schema
const calculationSchema = Joi.object({
  num1: Joi.number().required(),
  num2: Joi.number().required(),
  operation: Joi.string().valid('add', 'subtract', 'multiply', 'divide', 'power', 'modulo').required()
});

/**
 * Perform calculation
 * POST /api/calculator/calculate
 */
async function calculate(req, res) {
  try {
    // Validate input
    const { error, value } = calculationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const { num1, num2, operation } = value;
    let result;
    let operationSymbol;

    // Perform calculation
    switch (operation) {
      case 'add':
        result = num1 + num2;
        operationSymbol = '+';
        break;
      case 'subtract':
        result = num1 - num2;
        operationSymbol = '-';
        break;
      case 'multiply':
        result = num1 * num2;
        operationSymbol = '×';
        break;
      case 'divide':
        if (num2 === 0) {
          return res.status(400).json({
            success: false,
            error: 'Cannot divide by zero'
          });
        }
        result = num1 / num2;
        operationSymbol = '÷';
        break;
      case 'power':
        result = Math.pow(num1, num2);
        operationSymbol = '^';
        break;
      case 'modulo':
        if (num2 === 0) {
          return res.status(400).json({
            success: false,
            error: 'Cannot calculate modulo with zero'
          });
        }
        result = num1 % num2;
        operationSymbol = '%';
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid operation'
        });
    }

    // Create calculation record
    const calculationRecord = {
      num1,
      num2,
      operation,
      operationSymbol,
      result,
      calculation: `${num1} ${operationSymbol} ${num2}`,
      timestamp: new Date().toISOString(),
      userId: req.user?.uid || 'anonymous'
    };

    // Save to Firebase (if enabled)
    const db = getFirestore();
    if (db) {
      try {
        const docRef = await db.collection('calculations').add(calculationRecord);
        calculationRecord.id = docRef.id;
        console.log(`💾 Saved calculation to Firebase: ${docRef.id}`);
      } catch (firebaseError) {
        console.warn('⚠️  Failed to save to Firebase:', firebaseError.message);
        // Continue without Firebase
      }
    }

    // Log calculation
    console.log(`[${new Date().toISOString()}] Calculation: ${calculationRecord.calculation} = ${result}`);

    // Return response
    res.status(200).json({
      success: true,
      result,
      calculation: calculationRecord.calculation,
      timestamp: calculationRecord.timestamp,
      id: calculationRecord.id || null
    });

  } catch (error) {
    console.error('Calculation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

/**
 * Get calculation history
 * GET /api/calculator/history
 */
async function getHistory(req, res) {
  try {
    const db = getFirestore();
    
    if (!db) {
      return res.status(503).json({
        success: false,
        error: 'Database not available',
        message: 'Firebase is not configured'
      });
    }

    const userId = req.user?.uid || 'anonymous';
    const limit = parseInt(req.query.limit) || 50;

    // Query Firebase
    const snapshot = await db.collection('calculations')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();

    const calculations = [];
    snapshot.forEach(doc => {
      calculations.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.status(200).json({
      success: true,
      count: calculations.length,
      calculations
    });

  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch history'
    });
  }
}

/**
 * Delete calculation
 * DELETE /api/calculator/history/:id
 */
async function deleteCalculation(req, res) {
  try {
    const db = getFirestore();
    
    if (!db) {
      return res.status(503).json({
        success: false,
        error: 'Database not available'
      });
    }

    const { id } = req.params;
    await db.collection('calculations').doc(id).delete();

    res.status(200).json({
      success: true,
      message: 'Calculation deleted'
    });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete calculation'
    });
  }
}

/**
 * Get statistics
 * GET /api/calculator/stats
 */
async function getStats(req, res) {
  try {
    const db = getFirestore();
    
    if (!db) {
      return res.status(503).json({
        success: false,
        error: 'Database not available'
      });
    }

    const userId = req.user?.uid || 'anonymous';

    const snapshot = await db.collection('calculations')
      .where('userId', '==', userId)
      .get();

    const stats = {
      total: snapshot.size,
      operations: {},
      lastCalculation: null
    };

    snapshot.forEach(doc => {
      const data = doc.data();
      stats.operations[data.operation] = (stats.operations[data.operation] || 0) + 1;
      
      if (!stats.lastCalculation || data.timestamp > stats.lastCalculation.timestamp) {
        stats.lastCalculation = data;
      }
    });

    res.status(200).json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
}

module.exports = {
  calculate,
  getHistory,
  deleteCalculation,
  getStats
};
