import "dotenv/config";
import { app } from "./app";
import chalk from "chalk";

app.listen(process.env.PORT, () => {
  console.log(
    chalk.magentaBright.bold("🚀 SERVER ") +
      chalk.cyanBright.bold("IS RUNNING ") +
      chalk.yellowBright.bold(`ON PORT ${process.env.PORT}`),
  );
});
