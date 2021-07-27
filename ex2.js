//Ex 2: Given an array of integers, find integers with the most repetitions. If multiple numbers have the same maximum number of repetition, export all of them.  Maximum 3 rounds, not nested.

const arr = [3, 1, 8, 1, 2, 3, 4, 8, 5, 3, 3, 1, 5, 1, 2, 3, 4, 5, 5, 3, 5, 5];

const findMostRepetitions = (arr) => arr.reduce((acc, item) => {
  acc.countList[item] = acc.countList[item] + 1 || 1;
  
  if (acc.max <= acc.countList[item]) {
    if (acc.max !== acc.countList[item]) {
      acc.result.length = 0;
    }

    acc.max = acc.countList[item];
    acc.result.push(item);
  }

  return acc;
}, { max: 0, countList: {}, result: [] }).result;

console.log(findMostRepetitions(arr));
