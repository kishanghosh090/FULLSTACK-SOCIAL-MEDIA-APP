import { app } from "./app.js";
import "dotenv/config";
import connectDB from "./db/index.js";

const PORT = process.env.PORT || 3000;

// connected to DATABASE
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB CONNECTION ERROR", err);
    process.exit(1);
  });
  
