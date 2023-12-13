/** Database setup for BizTime. */

import { Client } from "pg";

const client = new Client({
  connectionString: "postgresql://postgres:postgres@localhost:5432/biztime"
});

client.connect().then();

export default client;