import { Client } from "@elastic/elasticsearch";
import fs from "fs";

const client = new Client({ node: "http://localhost:9200" });
const jsonFile = fs.readFileSync("testHanjaData.json");

jsonFile.forEach((i) => {
  console.log(i);
});

async function bootstrap() {
  /*https://velog.io/@alli-eunbi/Elastic-Search-%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0-with-NodeJS*/
  try {
    client.ping();
    console.log("9200번 포트 연결");
  } catch (e) {
    console.log(e);
  }
}
bootstrap();
