import { Client } from "@elastic/elasticsearch";
import { EventEmitter } from "events";
import { v4 as uuidv4 } from "uuid"; // ES Modules
import fs from "fs";
// import shim from "array.prototype.flatmap";
//https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/bulk_examples.html

// https://gemini.google.com/app/ad035f3411c57639
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
const indexName = "hanja-20240409-1";
const bulkFileName = "test-bulk.txt";
const bulkFileName2 = "test-bulk2.txt";
let testHanjaData = JSON.parse(fs.readFileSync("testHanjaData.json"));
const hanjaDicData = JSON.parse(fs.readFileSync("hanjaDic.json"));
testHanjaData = hanjaDicData;
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

/*for (let key in testHanjaData) {
  // console.log("key : ", key); // 프로퍼티 이름 출력
  const item = { value: testHanjaData[key] };
  let eachItemWithKey = {};
  testHanjaData[key].map((item) => {
    console.log(item);
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
}*/

let bulkArray = [];
for (let key in testHanjaData) {
  // console.log("key : ", key); // 프로퍼티 이름 출력
  const item = { value: testHanjaData[key] };
  let eachItemWithKey = {};
  testHanjaData[key].map((item) => {
    console.log(item);
    const uuidId = uuidv4();
    eachItemWithKey = { ...item, key, id: uuidId };
    // console.log("eachItemWithKey : ", eachItemWithKey);
    // const idForBulk = { index: { _index: indexName, _id: uuidId } };
    // fs.appendFile(
    //   bulkFileName2,
    //   JSON.stringify(eachItemWithKey) + "\r\n",
    //   (err) => err && console.error(err)
    // );
    bulkArray.push(eachItemWithKey);
  });
}
console.log(bulkArray[1]);

await client.indices.create(
  {
    index: indexName,
    operations: {
      mappings: {
        properties: {
          kor: { type: "text" },
          def: { type: "text" },
          key: { type: "keyword" },
        },
      },
    },
  },
  { ignore: [400] }
);

const operations = bulkArray.flatMap((doc) => [
  { index: { _index: indexName } },
  doc,
]);

const bulkResponse = await client.bulk({ refresh: true, operations });

if (bulkResponse.errors) {
  const erroredDocuments = [];
  // The items array has the same order of the dataset we just indexed.
  // The presence of the `error` key indicates that the operation
  // that we did for the document has failed.
  bulkResponse.items.forEach((action, i) => {
    const operation = Object.keys(action)[0];
    if (action[operation].error) {
      erroredDocuments.push({
        // If the status is 429 it means that you can retry the document,
        // otherwise it's very likely a mapping error, and you should
        // fix the document before to try it again.
        status: action[operation].status,
        error: action[operation].error,
        operation: operations[i * 2],
        document: operations[i * 2 + 1],
      });
    }
  });
  // console.log(erroredDocuments);
  //https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/bulk_examples.html
}

// const count = await client.count({ index: indexName });
// console.log(count);

// async function bootstrap()
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

/* 
Elasticsearch JavaScript Client Doc
 
https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html */
