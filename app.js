const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

app.use(express.json());

const db = new sqlite3.Database('./orders.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerName TEXT NOT NULL,
    product TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    status TEXT NOT NULL
  )
`);

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

app.get('/', (req, res) => {
  res.json({ message: 'Order API is running' });
});

app.post('/orders', async (req, res) => {
  try {
    const { customerName, product, quantity, status } = req.body;

    if (!customerName || !product || !quantity) {
      return res.status(400).json({
        error: 'customerName, product, and quantity are required'
      });
    }

    await delay(1500);

    const orderStatus = status || 'Pending';

    db.run(
      `INSERT INTO orders (customerName, product, quantity, status) VALUES (?, ?, ?, ?)`,
      [customerName, product, quantity, orderStatus],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        res.status(201).json({
          message: 'Order created successfully',
          order: {
            id: this.lastID,
            customerName,
            product,
            quantity,
            status: orderStatus
          }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error while creating order' });
  }
});

app.get('/orders', (req, res) => {
  db.all(`SELECT * FROM orders`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(200).json(rows);
  });
});

app.get('/orders/:id', (req, res) => {
  db.get(`SELECT * FROM orders WHERE id = ?`, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json(row);
  });
});

app.patch('/orders/:id', (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'status is required' });
  }

  db.run(
    `UPDATE orders SET status = ? WHERE id = ?`,
    [status, req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.status(200).json({
        message: 'Order status updated successfully',
        orderId: req.params.id,
        newStatus: status
      });
    }
  );
});

app.delete('/orders/:id', (req, res) => {
  db.run(`DELETE FROM orders WHERE id = ?`, [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({
      message: 'Order deleted successfully',
      deletedOrderId: req.params.id
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
