import app from "./app.js";

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
