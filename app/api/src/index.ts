import express from "express";

const app = express();
const PORT = 4000;

app.get("/", (req, res) => {
  res.send("Sorry can't find that");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
