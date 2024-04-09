import { Client } from "@elastic/elasticsearch";
import { EventEmitter } from "events";
import { v4 as uuidv4 } from "uuid"; // ES Modules
import fs from "fs";
// https://gemini.google.com/app/ad035f3411c57639
const client = new Client({
  node: "http://localhost:9200",
  log: "trace",
  tls: {
    ca: fs.readFileSync("http_ca.crt"),
    rejectUnauthorized: false,
  },
});
const indexName = "hanja-20240401";
const bulkFileName = "test-bulk.txt";
const testHanjaData = JSON.parse(fs.readFileSync("testHanjaData.json"));
const hanjaDicData = JSON.parse(fs.readFileSync("hanjaDicData.json"));
const eEmitter = new EventEmitter();

const newDocArray = [];

/**
 * const newFile = () => {
  fs.writeFile("test.txt", "test", (err) => {
    if (err) {
      console.log(err);
    }
    console.log("파일 생성 성공");
  });
};

newFile();
*/

for (let key in testHanjaData) {
  // console.log("key : ", key); // 프로퍼티 이름 출력
  const item = { value: testHanjaData[key] };
  let eachItemWithKey = {};
  testHanjaData[key].map((item) => {
    // console.log(item);
    eachItemWithKey = { ...item, key };
    // console.log("eachItemWithKey : ", eachItemWithKey);
    const uuidId = uuidv4();
    const idForBulk = { index: { _index: indexName, _id: uuidId } };
    fs.appendFile(
      bulkFileName,
      JSON.stringify(idForBulk) +
        "\r\n" +
        JSON.stringify(eachItemWithKey) +
        "\r\n",
      (err) => err && console.error(err)
    );
  });
}

// async function bootstrap() {
//   /*https://velog.io/@alli-eunbi/Elastic-Search-%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0-with-NodeJS*/
//   try {
//     client.ping();
//     console.log("9200번 포트 연결");
//   } catch (e) {
//     console.log(e);
//   }
// }
// bootstrap();

/**
 * 1. json 파일을 읽어온다.
 * 2. 한자 하나가 가지고 있는 배열을 순회하며, id값을 만들고, 한자를 그 안에 필드 추가로 document를 만든다.
 * 3. elasticsearch에 저장한다.
 */
