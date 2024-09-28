import express from "express";
import { drizzle } from "drizzle-orm/mysql2";
import { int, varchar, mysqlTable } from "drizzle-orm/mysql-core";
import mysql from "mysql2/promise";
import cors from "cors";
import ServerlessHttp from "serverless-http";

const app = express();
app.use(express.json());
app.use(cors());

// Schema definition
const items = mysqlTable("items", {
  id: int("id").primaryKey().autoincrement().notNull(),
  name: varchar("name", { length: 45 }).notNull(),
  price: int("price").notNull(),
  description: varchar("description", { length: 225 }),
  quantity: int("quantity").notNull(), // Corrected this line
});

// Connect to MySQL within the route handlers
async function getConnection() {
  return mysql.createConnection({
    host: "localhost",
    user: "Praisejah",
    password: "password",
    database: "budget_db",
  });
}

// Route to check the backend
app.get("/", (req, res) => {
  res.json("This is the backend");
});

// Get all items
app.get("/items", async (req, res) => {
  try {
    const connection = await getConnection();
    const db = drizzle(connection);
    const result = await db.select().from(items);
    await connection.end(); // Close connection after use
    return res.json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Create an item
app.post("/items", async (req, res) => {
  try {
    const connection = await getConnection();
    const db = drizzle(connection);
    await db
      .insert(items)
      .values({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        quantity: req.body.quantity,
      })
      .$returningId();
    await connection.end(); // Close connection after use
    return res.json("Item has been created successfully");
  } catch (error) {
    res.status(500).json(error);
  }
});

// Delete an item by id
app.delete("/items/:id", async (req, res) => {
  const itemId = req.params.id;
  try {
    const connection = await getConnection();
    const db = drizzle(connection);
    await db.delete(items).where(eq(items.id, itemId));
    await connection.end(); // Close connection after use
    return res.json("Item has been deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports.handler = ServerlessHttp(app);
