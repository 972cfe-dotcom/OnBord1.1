const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Frontend route - serve the calculator page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Backend API - Calculator endpoint
app.post('/api/calculate', (req, res) => {
  try {
    const { num1, num2, operation } = req.body;
    
    // Validation
    if (num1 === undefined || num2 === undefined || !operation) {
      return res.status(400).json({ 
        success: false, 
        error: 'נא לספק שני מספרים ופעולה חשבונית' 
      });
    }

    const number1 = parseFloat(num1);
    const number2 = parseFloat(num2);

    if (isNaN(number1) || isNaN(number2)) {
      return res.status(400).json({ 
        success: false, 
        error: 'הערכים חייבים להיות מספרים תקינים' 
      });
    }

    let result;
    let operationSymbol;

    // Perform calculation on server
    switch (operation) {
      case 'add':
        result = number1 + number2;
        operationSymbol = '+';
        break;
      case 'subtract':
        result = number1 - number2;
        operationSymbol = '-';
        break;
      case 'multiply':
        result = number1 * number2;
        operationSymbol = '×';
        break;
      case 'divide':
        if (number2 === 0) {
          return res.status(400).json({ 
            success: false, 
            error: 'לא ניתן לחלק באפס' 
          });
        }
        result = number1 / number2;
        operationSymbol = '÷';
        break;
      case 'power':
        result = Math.pow(number1, number2);
        operationSymbol = '^';
        break;
      case 'modulo':
        if (number2 === 0) {
          return res.status(400).json({ 
            success: false, 
            error: 'לא ניתן לחלק באפס (מודולו)' 
          });
        }
        result = number1 % number2;
        operationSymbol = '%';
        break;
      default:
        return res.status(400).json({ 
          success: false, 
          error: 'פעולה לא תקינה' 
        });
    }

    // Log calculation on server
    console.log(`[${new Date().toISOString()}] Calculation: ${number1} ${operationSymbol} ${number2} = ${result}`);

    // Return result
    res.json({
      success: true,
      result: result,
      calculation: `${number1} ${operationSymbol} ${number2}`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in calculation:', error);
    res.status(500).json({ 
      success: false, 
      error: 'שגיאה בשרת בעת ביצוע החישוב' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'Calculator Backend API'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found' 
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔧 Backend API: http://localhost:${PORT}/api/calculate`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/api/health`);
});
