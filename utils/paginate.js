export const ELLIPSIS = '...';

const generatePagination = (pageNumber, pageCount) => {
  if (pageCount === 1) {
    return [];
  }

  const delta = 2;
  const currentPage = pageNumber > pageCount ? pageCount : pageNumber;

  let range = [];
  for (
    let i = Math.max(2, currentPage - delta);
    i <= Math.min(pageCount - 1, currentPage + delta);
    i++
  ) {
    range.push(i);
  }
  const leftOffset = currentPage - delta;
  const rightOffset = currentPage + delta;

  if (leftOffset > 2) {
    range.unshift(leftOffset > 3 ? ELLIPSIS : 2);
  }

  if (rightOffset < pageCount - 1) {
    range.push(rightOffset < pageCount ? ELLIPSIS : pageCount - 1);
  }

  range.unshift(1);
  range.push(pageCount);

  return range;
};

// console.assert(
//   JSON.stringify(generatePagination(10, 50)) ===
//     JSON.stringify([1, '...', 8, 9, 10, 11, 12, '...', 50]),
//   'generatePagination(10, 50) => ',
//   generatePagination(10, 50)
// );
// console.assert(
//   JSON.stringify(generatePagination(50, 50)) ===
//     JSON.stringify([1, '...', 48, 49, 50]),
//   'generatePagination(50, 50) => ',
//   generatePagination(50, 50)
// );
// console.assert(
//   JSON.stringify(generatePagination(49, 50)) ===
//     JSON.stringify([1, '...', 47, 48, 49, 50]),
//   'generatePagination(49, 50) => ',
//   generatePagination(49, 50)
// );
// console.assert(
//   JSON.stringify(generatePagination(45, 50)) ===
//     JSON.stringify([1, '...', 43, 44, 45, 46, 47, '...', 50]),
//   generatePagination(45, 50)
// );
// console.assert(
//   JSON.stringify(generatePagination(30, 50)) ===
//     JSON.stringify([1, '...', 28, 29, 30, 31, 32, '...', 50]),
//   'generatePagination(30, 50) => ',
//   generatePagination(30, 50)
// );
// console.assert(
//   JSON.stringify(generatePagination(6, 50)) ===
//     JSON.stringify([1, '...', 4, 5, 6, 7, 8, '...', 50]),
//   'generatePagination(6, 50) => ',
//   generatePagination(6, 50)
// );
// console.assert(
//   JSON.stringify(generatePagination(5, 50)) ===
//     JSON.stringify([1, 2, 3, 4, 5, 6, 7, '...', 50]),
//   'generatePagination(5, 50) => ',
//   generatePagination(5, 50)
// );
// console.assert(
//   JSON.stringify(generatePagination(4, 50)) ===
//     JSON.stringify([1, 2, 3, 4, 5, 6, '...', 50]),
//   'generatePagination(4, 50) => ',
//   generatePagination(4, 50)
// );
// console.assert(
//   JSON.stringify(generatePagination(3, 50)) ===
//     JSON.stringify([1, 2, 3, 4, 5, '...', 50]),
//   'generatePagination(3, 50) => ',
//   generatePagination(3, 50)
// );
// console.assert(
//   JSON.stringify(generatePagination(2, 50)) ===
//     JSON.stringify([1, 2, 3, 4, '...', 50]),
//   'generatePagination(2, 50) => ',
//   generatePagination(2, 50)
// );
// console.assert(
//   JSON.stringify(generatePagination(1, 50)) ===
//     JSON.stringify([1, 2, 3, '...', 50]),
//   'generatePagination(1, 50) => ',
//   generatePagination(1, 50)
// );

// console.assert(
//   JSON.stringify(generatePagination(1, 1)) === JSON.stringify([]),
//   'generatePagination(1, 1) => ',
//   generatePagination(1, 1)
// );

// console.assert(
//   JSON.stringify(generatePagination(2, 1)) === JSON.stringify([]),
//   'generatePagination(2, 1) => ',
//   generatePagination(2, 1)
// );

// console.assert(
//   JSON.stringify(generatePagination(3, 2)) === JSON.stringify([1, 2]),
//   'generatePagination(3, 2) => ',
//   generatePagination(3, 2)
// );

// console.assert(
//   JSON.stringify(generatePagination(5, 10)) ===
//     JSON.stringify([1, 2, 3, 4, 5, 6, 7, '...', 10]),
//   'generatePagination(5, 10) => ',
//   generatePagination(5, 10)
// );

// console.assert(
//   JSON.stringify(generatePagination(1, 20)) ===
//     JSON.stringify([1, 2, 3, '...', 20]),
//   'generatePagination(1, 20) => ',
//   generatePagination(1, 20)
// );

// console.assert(
//   JSON.stringify(generatePagination(5, 20)) ===
//     JSON.stringify([1, 2, 3, 4, 5, 6, 7, '...', 20]),
//   'generatePagination(5, 20) => ',
//   generatePagination(5, 20)
// );

// console.assert(
//   JSON.stringify(generatePagination(10, 20)) ===
//     JSON.stringify([1, '...', 8, 9, 10, 11, 12, '...', 20]),
//   'generatePagination(10, 20) => ',
//   generatePagination(10, 20)
// );

// console.assert(
//   JSON.stringify(generatePagination(17, 20)) ===
//     JSON.stringify([1, '...', 15, 16, 17, 18, 19, 20]),
//   'generatePagination(17, 20) => ',
//   generatePagination(17, 20)
// );

export default generatePagination;
