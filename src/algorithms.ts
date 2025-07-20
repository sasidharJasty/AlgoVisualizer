// Sorting and Searching Algorithms Library
// Pure functions, no UI, no visualization

// Type for sorting (array of numbers)
export type NumArray = number[];

// Bubble Sort
export function bubbleSort(arr: NumArray): NumArray {
  const a = arr.slice();
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
      }
    }
  }
  return a;
}

// Selection Sort
export function selectionSort(arr: NumArray): NumArray {
  const a = arr.slice();
  for (let i = 0; i < a.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < a.length; j++) {
      if (a[j] < a[minIdx]) minIdx = j;
    }
    if (minIdx !== i) [a[i], a[minIdx]] = [a[minIdx], a[i]];
  }
  return a;
}

// Insertion Sort
export function insertionSort(arr: NumArray): NumArray {
  const a = arr.slice();
  for (let i = 1; i < a.length; i++) {
    let key = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
  }
  return a;
}

// Merge Sort
export function mergeSort(arr: NumArray): NumArray {
  if (arr.length <= 1) return arr.slice();
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
  function merge(l: NumArray, r: NumArray): NumArray {
    const result: NumArray = [];
    let i = 0, j = 0;
    while (i < l.length && j < r.length) {
      if (l[i] < r[j]) result.push(l[i++]);
      else result.push(r[j++]);
    }
    return result.concat(l.slice(i)).concat(r.slice(j));
  }
}

// Quick Sort
export function quickSort(arr: NumArray): NumArray {
  if (arr.length <= 1) return arr.slice();
  const a = arr.slice();
  const pivot = a[a.length - 1];
  const left = a.filter((v, i) => v < pivot && i !== a.length - 1);
  const right = a.filter((v, i) => v >= pivot && i !== a.length - 1);
  return quickSort(left).concat([pivot], quickSort(right));
}

// Heap Sort
export function heapSort(arr: NumArray): NumArray {
  const a = arr.slice();
  const n = a.length;
  function heapify(n: number, i: number) {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    if (l < n && a[l] > a[largest]) largest = l;
    if (r < n && a[r] > a[largest]) largest = r;
    if (largest !== i) {
      [a[i], a[largest]] = [a[largest], a[i]];
      heapify(n, largest);
    }
  }
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);
  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    heapify(i, 0);
  }
  return a;
}

// Gnome Sort
export function gnomeSort(arr: NumArray): NumArray {
  const a = arr.slice();
  let i = 0;
  while (i < a.length) {
    if (i === 0 || a[i] >= a[i - 1]) i++;
    else {
      [a[i], a[i - 1]] = [a[i - 1], a[i]];
      i--;
    }
  }
  return a;
}

// Pancake Sort
export function pancakeSort(arr: NumArray): NumArray {
  const a = arr.slice();
  function flip(end: number) {
    let start = 0;
    while (start < end) {
      [a[start], a[end]] = [a[end], a[start]];
      start++;
      end--;
    }
  }
  for (let currSize = a.length; currSize > 1; currSize--) {
    let mi = 0;
    for (let i = 0; i < currSize; i++) if (a[i] > a[mi]) mi = i;
    if (mi !== currSize - 1) {
      flip(mi);
      flip(currSize - 1);
    }
  }
  return a;
}

// Comb Sort
export function combSort(arr: NumArray): NumArray {
  const a = arr.slice();
  let gap = a.length;
  const shrink = 1.3;
  let sorted = false;
  while (!sorted) {
    gap = Math.floor(gap / shrink);
    if (gap <= 1) {
      gap = 1;
      sorted = true;
    }
    for (let i = 0; i + gap < a.length; i++) {
      if (a[i] > a[i + gap]) {
        [a[i], a[i + gap]] = [a[i + gap], a[i]];
        sorted = false;
      }
    }
  }
  return a;
}

// Odd-Even Sort
export function oddEvenSort(arr: NumArray): NumArray {
  const a = arr.slice();
  let sorted = false;
  while (!sorted) {
    sorted = true;
    for (let i = 1; i < a.length - 1; i += 2) {
      if (a[i] > a[i + 1]) {
        [a[i], a[i + 1]] = [a[i + 1], a[i]];
        sorted = false;
      }
    }
    for (let i = 0; i < a.length - 1; i += 2) {
      if (a[i] > a[i + 1]) {
        [a[i], a[i + 1]] = [a[i + 1], a[i]];
        sorted = false;
      }
    }
  }
  return a;
}

// Shell Sort
export function shellSort(arr: NumArray): NumArray {
  const a = arr.slice();
  let gap = Math.floor(a.length / 2);
  while (gap > 0) {
    for (let i = gap; i < a.length; i++) {
      let temp = a[i];
      let j = i;
      while (j >= gap && a[j - gap] > temp) {
        a[j] = a[j - gap];
        j -= gap;
      }
      a[j] = temp;
    }
    gap = Math.floor(gap / 2);
  }
  return a;
}

// Bitonic Sort (for power-of-two length arrays)
export function bitonicSort(arr: NumArray): NumArray {
  const a = arr.slice();
  function bitonicMerge(low: number, cnt: number, dir: boolean) {
    if (cnt > 1) {
      const k = Math.floor(cnt / 2);
      for (let i = low; i < low + k; i++) {
        if (dir === (a[i] > a[i + k])) {
          [a[i], a[i + k]] = [a[i + k], a[i]];
        }
      }
      bitonicMerge(low, k, dir);
      bitonicMerge(low + k, k, dir);
    }
  }
  function bitonicSortHelper(low: number, cnt: number, dir: boolean) {
    if (cnt > 1) {
      const k = Math.floor(cnt / 2);
      bitonicSortHelper(low, k, true);
      bitonicSortHelper(low + k, k, false);
      bitonicMerge(low, cnt, dir);
    }
  }
  bitonicSortHelper(0, a.length, true);
  return a;
}

// Bogo Sort (WARNING: very slow, only for small arrays)
export function bogoSort(arr: NumArray): NumArray {
  function isSorted(a: NumArray) {
    for (let i = 1; i < a.length; i++) if (a[i - 1] > a[i]) return false;
    return true;
  }
  const a = arr.slice();
  let tries = 0;
  while (!isSorted(a) && tries < 100000) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    tries++;
  }
  return a;
}

// Radix Sort (for non-negative integers)
export function radixSort(arr: NumArray): NumArray {
  const a = arr.slice();
  const max = Math.max(...a);
  let exp = 1;
  while (Math.floor(max / exp) > 0) {
    const output = new Array(a.length).fill(0);
    const count = new Array(10).fill(0);
    for (let i = 0; i < a.length; i++) count[Math.floor(a[i] / exp) % 10]++;
    for (let i = 1; i < 10; i++) count[i] += count[i - 1];
    for (let i = a.length - 1; i >= 0; i--) {
      const digit = Math.floor(a[i] / exp) % 10;
      output[count[digit] - 1] = a[i];
      count[digit]--;
    }
    for (let i = 0; i < a.length; i++) a[i] = output[i];
    exp *= 10;
  }
  return a;
}

// Decide Sort (Randomized Quick Sort)
export function decideSort(arr: NumArray): NumArray {
  if (arr.length <= 1) return arr.slice();
  const a = arr.slice();
  const randomIndex = Math.floor(Math.random() * a.length);
  [a[randomIndex], a[a.length - 1]] = [a[a.length - 1], a[randomIndex]];
  const pivot = a[a.length - 1];
  const left = a.filter((v, i) => v < pivot && i !== a.length - 1);
  const right = a.filter((v, i) => v >= pivot && i !== a.length - 1);
  return decideSort(left).concat([pivot], decideSort(right));
}

// Salt Shaker Sort (Shaker/Cocktail Sort)
export function saltShakerSort(arr: NumArray): NumArray {
  const a = arr.slice();
  let left = 0, right = a.length - 1;
  let swapped = true;
  while (swapped) {
    swapped = false;
    for (let i = left; i < right; i++) {
      if (a[i] > a[i + 1]) {
        [a[i], a[i + 1]] = [a[i + 1], a[i]];
        swapped = true;
      }
    }
    right--;
    for (let i = right; i > left; i--) {
      if (a[i - 1] > a[i]) {
        [a[i - 1], a[i]] = [a[i], a[i - 1]];
        swapped = true;
      }
    }
    left++;
  }
  return a;
}

// Linear Search
export function linearSearch(arr: NumArray, target: number): number {
  for (let i = 0; i < arr.length; i++) if (arr[i] === target) return i;
  return -1;
}

// Binary Search (array must be sorted)
export function binarySearch(arr: NumArray, target: number): number {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

// Jump Search (array must be sorted)
export function jumpSearch(arr: NumArray, target: number): number {
  const n = arr.length;
  const step = Math.floor(Math.sqrt(n));
  let prev = 0;
  while (arr[Math.min(step, n) - 1] < target) {
    prev = step;
    if (prev >= n) return -1;
  }
  while (arr[prev] < target) {
    prev++;
    if (prev === Math.min(step, n)) return -1;
  }
  if (arr[prev] === target) return prev;
  return -1;
}

// Interpolation Search (array must be sorted)
export function interpolationSearch(arr: NumArray, target: number): number {
  let low = 0, high = arr.length - 1;
  while (low <= high && target >= arr[low] && target <= arr[high]) {
    if (low === high) {
      if (arr[low] === target) return low;
      return -1;
    }
    const pos = low + Math.floor(((high - low) / (arr[high] - arr[low])) * (target - arr[low]));
    if (arr[pos] === target) return pos;
    if (arr[pos] < target) low = pos + 1;
    else high = pos - 1;
  }
  return -1;
}

// Exponential Search (array must be sorted)
export function exponentialSearch(arr: NumArray, target: number): number {
  if (arr[0] === target) return 0;
  let i = 1;
  while (i < arr.length && arr[i] <= target) i *= 2;
  return binarySearch(arr.slice(Math.floor(i / 2), Math.min(i, arr.length)), target);
}

// Fibonacci Search (array must be sorted)
export function fibonacciSearch(arr: NumArray, target: number): number {
  const n = arr.length;
  let fibMMm2 = 0, fibMMm1 = 1, fibM = fibMMm2 + fibMMm1;
  while (fibM < n) {
    fibMMm2 = fibMMm1;
    fibMMm1 = fibM;
    fibM = fibMMm2 + fibMMm1;
  }
  let offset = -1;
  while (fibM > 1) {
    const i = Math.min(offset + fibMMm2, n - 1);
    if (arr[i] < target) {
      fibM = fibMMm1;
      fibMMm1 = fibMMm2;
      fibMMm2 = fibM - fibMMm1;
      offset = i;
    } else if (arr[i] > target) {
      fibM = fibMMm2;
      fibMMm1 = fibMMm1 - fibMMm2;
      fibMMm2 = fibM - fibMMm1;
    } else {
      return i;
    }
  }
  if (fibMMm1 && offset + 1 < n && arr[offset + 1] === target) return offset + 1;
  return -1;
} 