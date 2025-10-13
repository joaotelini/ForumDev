import { SQL } from "bun";

const db = new SQL("mysql://root:root@localhost:3306/db_forumdev");

export default db;
