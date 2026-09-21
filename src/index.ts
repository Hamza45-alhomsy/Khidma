import { app } from "./server";
import { env } from "../env";
const PORT = env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`The server is working on port ${PORT}`);
});
