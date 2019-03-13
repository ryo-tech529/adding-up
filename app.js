'use strict';
/**
 * 
ファイルからデータを読み取る
2010 年と 2015 年のデータを選ぶ
都道府県ごとの変化率を計算する
変化率ごとに並べる
並べられたものを表示する
 * 
 */
const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
const prefectureDataMap = new Map();//key:prefecture value:year

rl.on('line',(lineString)=>{
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[2];
    const popu = parseInt(columns[7]);
    
    if(year == 2010 || year == 2015){
        let value = prefectureDataMap.get(prefecture);
        if(!value){
            value = {
                popu10:0,
                popu15:0,
                change:null
            };
        }

        if(year == 2010){
            value.popu10 += popu;
        }
        if(year == 2015){
            value.popu15 += popu;
        }
        prefectureDataMap.set(prefecture,value);
    }
});
rl.on('close',() => {
    for (let [key,value] of prefectureDataMap) {
        value.change = value.popu15 / value.popu10;
    }
    const rankingArray = Array.from(prefectureDataMap).sort((pair1,pair2)=>{
        //console.log(pair1[0]);
        //console.log(pair2[0]);
        return pair2[1].change - pair1[1].change;
    });
    const rankingStrings = rankingArray.map(([key,value])=>{
        return key + ':' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change;
    });

    console.log(rankingStrings);
});