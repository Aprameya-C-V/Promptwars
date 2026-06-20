import { app } from "./app.js";
import { env } from "./config/env.js";

if (!process.env.VERCEL) {
  app.listen(env.PORT, () => {
    console.log(`Hesychia backend listening on port ${env.PORT}`);
  });
}

export default app;
