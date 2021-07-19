// Ex 1: Given an array of integers, removing duplicate elements and creating an array whose elements are unique. (Eg: [1,2,2,3,4,4,4,5,6] => [1,2,3,4,5,6]). Find 3-4 ways to solve this.

const arr = [1,2,2,3,4,4,4,5,6];

// Using Set data structure.
const rmvDuplElement = (arr) => Array.from(new Set(arr));

// For each
const rmvDuplElement2 = (arr) => {
  let tmp = [];

  arr.forEach(item => {
    if (!tmp.includes(item)) tmp.push(item);
  });

  return tmp;
};

// Using filter method
const rmvDuplElement3 = (arr) => {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

console.log(rmvDuplElement3(arr));
