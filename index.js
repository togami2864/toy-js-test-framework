const fs = require("fs");

const tests = [];

//matcherの定義
const expect = (received) => ({
  toBe: (expected) => {
    if (received !== expected) {
      throw new Error(`Expected ${expected} but received ${received}.`);
    }
    return true;
  },
});

// test関数の定義
const it = (title, fn) => tests.push([title, fn]);

const root = process.cwd();
// 1. glob(本来であればglobを使う)
const testFilePath = ["__test__/index.test.js"];

for (file of testFilePath) {
  //2. setup(コードの評価。今回の場合`it`が実行される。)
  // 本来はevalはつかわない && readFileもしないrequireやimportで行う。
  // ex)
  //    for (file of testFilePath) {
  //       await import(file)
  //
  const code = fs.readFileSync(`${root}/${file}`, "utf-8");
  eval(code);

  const results = [];
  for ([title, fn] of tests) {
    const result = {
      title,
      success: false,
      error: null,
    };

    try {
      // 3. assertion実行(今回の場合`expect(true).toBe(true)`)
      fn();
      result.success = true;
    } catch (e) {
      // もしもfn()でエラーが起こったらcatch節へ
      result.error = e;
    }
    results.push(result);
  }
  console.log(results);
}
