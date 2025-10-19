/**
 * Calculator Routes
 * Define API endpoints for calculator operations
 */

const express = require('express');
const router = express.Router();
const calculatorController = require('../controllers/calculator.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @route   POST /api/calculator/calculate
 * @desc    Perform calculation
 * @access  Public
 */
router.post('/calculate', calculatorController.calculate);

/**
 * @route   GET /api/calculator/history
 * @desc    Get calculation history
 * @access  Private (requires authentication)
 */
router.get('/history', authMiddleware.optional, calculatorController.getHistory);

/**
 * @route   DELETE /api/calculator/history/:id
 * @desc    Delete specific calculation
 * @access  Private
 */
router.delete('/history/:id', authMiddleware.optional, calculatorController.deleteCalculation);

/**
 * @route   GET /api/calculator/stats
 * @desc    Get calculation statistics
 * @access  Private
 */
router.get('/stats', authMiddleware.optional, calculatorController.getStats);

module.exports = router;
