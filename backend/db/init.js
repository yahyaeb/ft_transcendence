import { db } from "./database.js";
import { readFileSync } from "fs";

const schema = readFileSync("./schema.sql", "utf8");
await db.exec(schema);

console.log("Database initilized");
process.exit(0);