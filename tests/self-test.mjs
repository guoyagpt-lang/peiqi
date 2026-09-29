import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
const scripts=[...html.matchAll(/<script(?:[^>]*)>([\s\S]*?)<\/script>/g)].map(x=>x[1]).join('\n');

new Function(scripts);

const required=[
  ['500词库基线',/while\(bank\.length<500\)/],
  ['词库拼读',/phonicsSpelling\(x\.en\)/],
  ['词库发音按钮',/data-speak-id/],
  ['KILL反馈',/⚡ KILL/],
  ['掌握进度',/libraryMastered/],
  ['剩余天数',/Math\.ceil\(\(total-mastered\)\/6\)/],
  ['错题必须重答',/必须拼对才能进入下一题/],
  ['次日错词优先',/needsReview&&memory\[x\.id\]\?\.reviewAfter<=now/],
  ['每10天测验',/Math\.floor\(packs\/10\)\*10/],
  ['最近10组出题',/packHistory\.slice\(-10\)/],
  ['80分门槛',/score>=80/],
  ['错误率低于10%',/errorRate<10/],
  ['20元奖金',/妈妈额外考试奖金20元/],
  ['云端同步测验',/plan\.quizResults=quizResults/]
];

for(const [name,pattern] of required)assert.match(html,pattern,`${name} 未实现`);

const estimate=(total,mastered)=>Math.ceil((total-mastered)/6);
assert.equal(estimate(500,50),75,'完成10%后的预计天数应为75天');
assert.equal(estimate(500,500),0,'全部掌握后预计天数应为0');

const qualifies=(score,errorRate)=>score>=80&&errorRate<10;
assert.equal(qualifies(100,0),true);
assert.equal(qualifies(90,10),false,'错误率必须严格低于10%');
assert.equal(qualifies(80,5),true);
assert.equal(qualifies(79,0),false);

console.log(`SELF-TEST PASS: ${required.length+6} checks`);
