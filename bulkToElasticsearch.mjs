import { Client } from "@elastic/elasticsearch";
import fs from "fs";

const client = new Client({ node: "http://localhost:9200" });
const testHanjaData = JSON.parse(fs.readFileSync("testHanjaData.json"));

for (let key in testHanjaData) {
  console.log(key); // 프로퍼티 이름 출력
}

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

/**
 * 1. json 파일을 읽어온다.
 * 2. 한자 하나가 가지고 있는 배열을 순회하며, id값을 만들고, 한자를 그 안에 필드 추가로 document를 만든다.
 * 3. elasticsearch에 저장한다.
 */
