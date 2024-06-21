const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Default password for MySQL in XAMPP is empty
  database: "activity_tracker",
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySQL connected...");
});

app.get("/tests", (req, res) => {
  const sql = "SELECT * FROM tests";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.get("/tests/:id", (req, res) => {
  const testId = req.params.id;
  const sql = `SELECT * FROM activities WHERE test_id = ${testId}`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.post("/tests/:id/activities/:activityId/complete", (req, res) => {
  const testId = req.params.id;
  const activityId = req.params.activityId;
  const sql = `UPDATE activities SET completed = !completed WHERE id = ${activityId} AND test_id = ${testId}`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json({ message: "Activity marked as completed" });
  });
});

app.post("/tests/:id/reset", (req, res) => {
  const testId = req.params.id;
  const sql = `UPDATE activities SET completed = FALSE WHERE test_id = ${testId}`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json({ message: "All activities have been reset" });
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
