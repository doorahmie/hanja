import { Client } from "@elastic/elasticsearch";
import { EventEmitter } from "events";
import { v4 as uuidv4 } from "uuid"; // ES Modules
import fs from "fs";

const client = new Client({
  node: "http://localhost:9200",
  log: "trace",
  tls: {
    ca: fs.readFileSync("http_ca.crt"),
    rejectUnauthorized: false,
  },
  auth: {
    id: "elastic",
    password: "3BwGiJHEX8olEGiJEKDp",
  },
});
const indexName = "hanja-20240401";
const bulkFileName = "test-bulk.txt";
let testHanjaData = JSON.parse(fs.readFileSync("testHanjaData.json"));
const hanjaDicData = JSON.parse(fs.readFileSync("hanjaDic.json"));
testHanjaData = hanjaDicData;
const eEmitter = new EventEmitter();

const newDocArray = [];
