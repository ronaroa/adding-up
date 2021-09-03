'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs, output: {} });
//データを組み替えることができるコード
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト
rl.on('line', lineString => {
    //ファイルを行単位で処理するコード
    //列別のデータに分割
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
  const popu = parseInt(columns[3]);
  if (year === 2010 || year === 2015) {
    let value = prefectureDataMap.get(prefecture);
    //都道府県ごとのデータの入れ物を作る
    if (!value) {
        value = {
        popu10: 0,//2010の人口のデータ
        popu15: 0,//2015の人口のデータ
        change: null//変化率
        };
    }
    if (year === 2010) {
        value.popu10 = popu;
    }
    if (year === 2015) {
        value.popu15 = popu;
    }
    prefectureDataMap.set(prefecture, value);
  }
});
rl.on('close', () => {
   for (const[key,value] of prefectureDataMap) {
    value.change = value.popu15 / value.popu10;
   }
   const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
    return pair2[1].change - pair1[1].change;
   });
   const rankingStrings = rankingArray.map(([key,value]) => {
    return (
        key +
        ': ' +
        value.popu10 +
        '=>' +
        value.popu15 +
        ' 変化率:' +
        value.change
      );
   });
   console.log(rankingStrings);
});