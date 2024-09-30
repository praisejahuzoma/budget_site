import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
// Create an asynchronous connection to MySQL
const createConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "Praisejah",
      password: "password",
      database: "budget_db",
    });
    console.log("Connected to MySQL as ID:", connection.threadId);
    return connection;
  } catch (err) {
    console.error("Error connecting to MySQL:", err);
    throw err;
  }
};
// Route to check the backend
app.get("/", (req, res) => {
  res.json("This is the backend");
});
// Get all items from MySQL
app.get("/items", async (req, res) => {
  try {
    const connection = await createConnection();
    const [rows] = await connection.execute("SELECT * FROM items");
    res.json(rows);
    await connection.end(); // Close the connection after query
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).json({ message: "Error fetching items", error: err });
  }
});
// Add a new item
app.post("/items", async (req, res) => {
  const { name, price, description, quantity } = req.body;
  console.log("Received request to add item:", {
    name,
    price,
    description,
    quantity,
  }); // Debugging line
  try {
    const connection = await createConnection();
    const [result] = await connection.execute(
      "INSERT INTO items (name, price, description, quantity) VALUES (?, ?, ?, ?)",
      [name, price, description, quantity]
    );
    res.json({ message: "Item created", id: result.insertId });
    await connection.end(); // Close the connection after query
  } catch (err) {
    console.error("Error creating item:", err); // Debugging line
    res.status(500).json({ message: "Error creating item", error: err });
  }
});
// Delete an item
app.delete("/items/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await createConnection();
    await connection.execute("DELETE FROM items WHERE id = ?", [id]);
    res.json({ message: "Item deleted" });
    await connection.end();
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ message: "Error deleting item", error: err });
  }
});
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
