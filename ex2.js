//Ex 2: Given an array of integers, find integers with the most repetitions. If multiple numbers have the same maximum number of repetition, export all of them.  Maximum 3 rounds, not nested.

const arr = [3, 1, 8, 1, 2, 3, 4, 8, 5, 3, 3, 1, 5, 1, 2, 3, 4, 5, 5, 3];

const findMostRepetitions = (arr) => {
  let map = new Map();
  let max = 0;
  let result = [];
  
  arr.forEach(item => {
    // if item exist -> increase count
    let count = map.get(item) + 1 || 1;
    map.set(item, count);

    // find the most repetition
    if (max < map.get(item)) max = map.get(item);
  });

  // get integers with the most repetitions
  for (let [nu, count] of map) {
    if (count === max) result.push(nu);
  }

  return result;
};

console.log(findMostRepetitions(arr));
