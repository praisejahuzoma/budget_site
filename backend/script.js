import express from "express";
import { drizzle } from "drizzle-orm/mysql2";
import { int, varchar, mysqlTable } from "drizzle-orm/mysql-core";
import mysql from "mysql2/promise";
import cors from "cors";

const app = express();

// Create an asynchronous connection to MySQL
const connection = await mysql.createConnection({
  host: "localhost",
  user: "Praisejah",
  password: "password",
  database: "budget_db",
});

// Initialize Drizzle ORM with the connection
const db = drizzle(connection);

// Schema definition
const items = mysqlTable("items", {
  id: int("id").primaryKey().autoincrement().notNull(),
  name: varchar("name", { length: 45 }).notNull(),
  price: int("price").notNull(),
  description: varchar("description", { length: 225 }),
  price: int("quantity").notNull(),
});

app.use(express.json());
app.use(cors());

// Route to check the backend
app.get("/", (req, res) => {
  res.json("This is the backend");
});

// Get all books
app.get("/items", async (req, res) => {
  try {
    const result = await db.select().from(items);
    if (!Array.isArray(result)) {
      return res.status(500).json({ error: "Unexpected data format" });
    }
    return res.json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Create a book
app.post("/items", async (req, res) => {
  try {
    await db
      .insert(items)
      .values({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        quantity: req.body.quantity,
      })
      .$returningId();
    return res.json("items has been created successfully");
  } catch (error) {
    res.status(500).json(error);
  }
});

// Delete a book by id
app.delete("/items/:id", async (req, res) => {
  const itemId = req.params.id;
  try {
    await db.delete(items).where(eq(items.id, itemId));
    return res.json("items has been deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});



// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
