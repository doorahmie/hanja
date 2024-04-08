import { Client } from "@elastic/elasticsearch";
import { EventEmitter } from "events";
import { v4 as uuidv4 } from "uuid"; // ES Modules
import fs from "fs";
// https://gemini.google.com/app/ad035f3411c57639
const client = new Client({ node: "http://localhost:9200", log: "trace" });
const indexName = "hanja-20240401";
const testHanjaData = JSON.parse(fs.readFileSync("testHanjaData.json"));
const eEmitter = new EventEmitter();

// const newDocArray = [];
for (let key in testHanjaData) {
  // console.log(key); // 프로퍼티 이름 출력
  // const item = { value: testHanjaData[key] };
  let eachItemWithKey = {};
  testHanjaData[key].map((item) => {
    // console.log(item);
    eachItemWithKey = { ...item, key };
    console.log(eachItemWithKey);
    const id = uuidv4();
    fs.writeFile("");
    /**
     * text 파일로 값 생성한뒤
     * 한줄 씩 밀어넣는 bulk로 진행
     */
    // client.index(
    //   {
    //     index: indexName,
    //     body: eachItemWithKey,
    //   },
    //   (err, result) => {
    //     if (err) {
    //       console.log(err);
    //     }
    //     console.log("저장 성공: ", result);
    //   }
    // );
  });
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
