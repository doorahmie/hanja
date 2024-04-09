import { Client } from "@elastic/elasticsearch";
import { EventEmitter } from "events";
import { v4 as uuidv4 } from "uuid"; // ES Modules
import fs from "fs";

const client = new Client({
  node: "https://localhost:9200",
  tls: {
    ca: fs.readFileSync("./http_ca.crt"),
    rejectUnauthorized: false,
  },
  auth: {
    username: "elastic",
    password: "3BwGiJHEX8olEGiJEKDp",
  },
});

async function connectionTest() {
  /*https://velog.io/@alli-eunbi/Elastic-Search-%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0-with-NodeJS*/
  try {
    client.ping();
    console.log("9200번 포트 연결");
  } catch (e) {
    // console.log(e);
    console.log("9200번 포트 연결 실패");
  }
}
connectionTest();

// const indexName = "hanja-20240409-1";
// let testHanjaData = JSON.parse(fs.readFileSync("testHanjaData.json"));
// const hanjaDicData = JSON.parse(fs.readFileSync("hanjaDic.json"));
// testHanjaData = hanjaDicData;

// await client.indices.create(
//   {
//     index: indexName,
//     operations: {
//       mappings: {
//         properties: {
//           kor: { type: "text" },
//           def: { type: "text" },
//           key: { type: "keyword" },
//         },
//       },
//     },
//   },
//   { ignore: [400] }
// );

// let bulkArray = [];
// for (let key in testHanjaData) {
//   // console.log("key : ", key); // 프로퍼티 이름 출력
//   const item = { value: testHanjaData[key] };
//   let eachItemWithKey = {};
//   testHanjaData[key].map((item) => {
//     console.log(item);
//     const uuidId = uuidv4();
//     eachItemWithKey = { ...item, key, id: uuidId };

//     bulkArray.push(eachItemWithKey);
//   });
// }
// console.log(bulkArray[1]);

// const operations = bulkArray.flatMap((doc) => [
//   { index: { _index: indexName } },
//   doc,
// ]);

// const bulkResponse = await client.bulk({ refresh: true, operations });

// if (bulkResponse.errors) {
//   const erroredDocuments = [];
//   // The items array has the same order of the dataset we just indexed.
//   // The presence of the `error` key indicates that the operation
//   // that we did for the document has failed.
//   bulkResponse.items.forEach((action, i) => {
//     const operation = Object.keys(action)[0];
//     if (action[operation].error) {
//       erroredDocuments.push({
//         // If the status is 429 it means that you can retry the document,
//         // otherwise it's very likely a mapping error, and you should
//         // fix the document before to try it again.
//         status: action[operation].status,
//         error: action[operation].error,
//         operation: operations[i * 2],
//         document: operations[i * 2 + 1],
//       });
//     }
//   });
//   //https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/bulk_examples.html
// }
