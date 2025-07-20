// Step-yielding (generator) version of Bubble Sort for visualization
// Yields: { array: number[], comparing: [number, number], swapped: boolean }

export interface BubbleSortStep {
  array: number[];
  comparing: [number, number] | null;
  swapped: boolean;
  sortedIndices: number[];
}

export function* bubbleSortSteps(input: number[]): Generator<BubbleSortStep> {
  const arr = input.slice();
  const n = arr.length;
  let sortedIndices: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      yield { array: arr.slice(), comparing: [j, j + 1], swapped: false, sortedIndices: sortedIndices.slice() };
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
        yield { array: arr.slice(), comparing: [j, j + 1], swapped: true, sortedIndices: sortedIndices.slice() };
      }
    }
    sortedIndices.unshift(n - 1 - i);
    yield { array: arr.slice(), comparing: null, swapped: false, sortedIndices: sortedIndices.slice() };
    if (!swapped) break;
  }
  // Mark all as sorted at the end
  yield { array: arr.slice(), comparing: null, swapped: false, sortedIndices: Array.from({ length: n }, (_, i) => i) };
}

// --- Selection Sort Step Generator ---
export interface SelectionSortStep {
  array: number[];
  comparing: [number, number] | null;
  minIndex: number | null;
  sortedIndices: number[];
  swapped: boolean;
}

export function* selectionSortSteps(input: number[]): Generator<SelectionSortStep> {
  const arr = input.slice();
  const n = arr.length;
  let sortedIndices: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      yield { array: arr.slice(), comparing: [minIdx, j], minIndex: minIdx, sortedIndices: sortedIndices.slice(), swapped: false };
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        yield { array: arr.slice(), comparing: [minIdx, j], minIndex: minIdx, sortedIndices: sortedIndices.slice(), swapped: false };
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      yield { array: arr.slice(), comparing: [i, minIdx], minIndex: minIdx, sortedIndices: sortedIndices.slice(), swapped: true };
    }
    sortedIndices.push(i);
    yield { array: arr.slice(), comparing: null, minIndex: null, sortedIndices: sortedIndices.slice(), swapped: false };
  }
  yield { array: arr.slice(), comparing: null, minIndex: null, sortedIndices: Array.from({ length: n }, (_, i) => i), swapped: false };
}

// --- Insertion Sort Step Generator ---
export interface InsertionSortStep {
  array: number[];
  comparing: [number, number] | null;
  sortedIndices: number[];
  swapped: boolean;
}

export function* insertionSortSteps(input: number[]): Generator<InsertionSortStep> {
  const arr = input.slice();
  const n = arr.length;
  let sortedIndices: number[] = [];
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      yield { array: arr.slice(), comparing: [j, j + 1], sortedIndices: sortedIndices.slice(), swapped: true };
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
    sortedIndices = Array.from({ length: i + 1 }, (_, k) => k);
    yield { array: arr.slice(), comparing: null, sortedIndices: sortedIndices.slice(), swapped: false };
  }
  yield { array: arr.slice(), comparing: null, sortedIndices: Array.from({ length: n }, (_, i) => i), swapped: false };
}

// --- Linear Search Step Generator ---
export interface LinearSearchStep {
  array: number[];
  current: number;
  found: number | null;
  target: number;
  path: number[];
}

export function* linearSearchSteps(input: number[], target: number): Generator<LinearSearchStep> {
  const arr = input.slice();
  const path: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    path.push(i);
    if (arr[i] === target) {
      yield { array: arr.slice(), current: i, found: i, target, path: path.slice() };
      return;
    } else {
      yield { array: arr.slice(), current: i, found: null, target, path: path.slice() };
    }
  }
  yield { array: arr.slice(), current: -1, found: null, target, path: path.slice() };
}

// --- Binary Search Step Generator ---
export interface BinarySearchStep {
  array: number[];
  left: number;
  right: number;
  mid: number;
  found: number | null;
  target: number;
  path: number[];
}

export function* binarySearchSteps(input: number[], target: number): Generator<BinarySearchStep> {
  const arr = input.slice().sort((a, b) => a - b);
  let left = 0, right = arr.length - 1;
  const path: number[] = [];
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    path.push(mid);
    if (arr[mid] === target) {
      yield { array: arr.slice(), left, right, mid, found: mid, target, path: path.slice() };
      return;
    }
    yield { array: arr.slice(), left, right, mid, found: null, target, path: path.slice() };
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  yield { array: arr.slice(), left, right, mid: -1, found: null, target, path: path.slice() };
} 

// --- Merge Sort Step Generator ---
export interface MergeSortStep {
  array: number[];
  merging: [number, number] | null;
  left: number;
  right: number;
  sortedIndices: number[];
}

export function* mergeSortSteps(input: number[]): Generator<MergeSortStep> {
  const arr = input.slice();
  const n = arr.length;
  const sortedIndices: number[] = [];
  function* mergeSortHelper(left: number, right: number): Generator<MergeSortStep> {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      yield* mergeSortHelper(left, mid);
      yield* mergeSortHelper(mid + 1, right);
      yield* merge(left, mid, right);
    }
  }
  function* merge(left: number, mid: number, right: number): Generator<MergeSortStep> {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;
    while (i < leftArr.length && j < rightArr.length) {
      yield { array: arr.slice(), merging: [k, right], left, right, sortedIndices: sortedIndices.slice() };
      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      k++;
    }
    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      i++; k++;
      yield { array: arr.slice(), merging: [k - 1, right], left, right, sortedIndices: sortedIndices.slice() };
    }
    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      j++; k++;
      yield { array: arr.slice(), merging: [k - 1, right], left, right, sortedIndices: sortedIndices.slice() };
    }
  }
  yield* mergeSortHelper(0, n - 1);
  yield { array: arr.slice(), merging: null, left: 0, right: n - 1, sortedIndices: Array.from({ length: n }, (_, i) => i) };
}

// --- Quick Sort Step Generator ---
export interface QuickSortStep {
  array: number[];
  comparing: [number, number] | null;
  pivot: number | null;
  sortedIndices: number[];
  swapped: boolean;
}

export function* quickSortSteps(input: number[]): Generator<QuickSortStep> {
  const arr = input.slice();
  const n = arr.length;
  const sortedIndices: number[] = [];
  function* quickSortHelper(low: number, high: number): Generator<QuickSortStep> {
    if (low < high) {
      const pi = yield* partition(low, high);
      yield* quickSortHelper(low, pi - 1);
      yield* quickSortHelper(pi + 1, high);
    }
  }
  function* partition(low: number, high: number): Generator<any, number, any> {
    const pivotValue = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      yield { array: arr.slice(), comparing: [j, high], pivot: high, sortedIndices: sortedIndices.slice(), swapped: false };
      if (arr[j] < pivotValue) {
        i++;
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          yield { array: arr.slice(), comparing: [i, j], pivot: high, sortedIndices: sortedIndices.slice(), swapped: true };
        }
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    yield { array: arr.slice(), comparing: [i + 1, high], pivot: high, sortedIndices: sortedIndices.slice(), swapped: true };
    return i + 1;
  }
  yield* quickSortHelper(0, n - 1);
  yield { array: arr.slice(), comparing: null, pivot: null, sortedIndices: Array.from({ length: n }, (_, i) => i), swapped: false };
}

// --- Heap Sort Step Generator ---
export interface HeapSortStep {
  array: number[];
  comparing: [number, number] | null;
  sortedIndices: number[];
  swapped: boolean;
}

export function* heapSortSteps(input: number[]): Generator<HeapSortStep> {
  const arr = input.slice();
  const n = arr.length;
  const sortedIndices: number[] = [];
  function* heapify(n: number, i: number): Generator<HeapSortStep> {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    if (left < n) {
      yield { array: arr.slice(), comparing: [largest, left], sortedIndices: sortedIndices.slice(), swapped: false };
      if (arr[left] > arr[largest]) largest = left;
    }
    if (right < n) {
      yield { array: arr.slice(), comparing: [largest, right], sortedIndices: sortedIndices.slice(), swapped: false };
      if (arr[right] > arr[largest]) largest = right;
    }
    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      yield { array: arr.slice(), comparing: [i, largest], sortedIndices: sortedIndices.slice(), swapped: true };
      yield* heapify(n, largest);
    }
  }
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(n, i);
  }
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    sortedIndices.unshift(i);
    yield { array: arr.slice(), comparing: [0, i], sortedIndices: sortedIndices.slice(), swapped: true };
    yield* heapify(i, 0);
  }
  yield { array: arr.slice(), comparing: null, sortedIndices: Array.from({ length: n }, (_, i) => i), swapped: false };
}

// --- Gnome Sort Step Generator ---
export interface GnomeSortStep {
  array: number[];
  comparing: [number, number] | null;
  sortedIndices: number[];
  swapped: boolean;
}

export function* gnomeSortSteps(input: number[]): Generator<GnomeSortStep> {
  const arr = input.slice();
  const n = arr.length;
  let i = 0;
  while (i < n) {
    if (i === 0 || arr[i] >= arr[i - 1]) {
      i++;
    } else {
      [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
      yield { array: arr.slice(), comparing: [i, i - 1], sortedIndices: [], swapped: true };
      i--;
    }
  }
  yield { array: arr.slice(), comparing: null, sortedIndices: Array.from({ length: n }, (_, i) => i), swapped: false };
}

// --- Pancake Sort Step Generator ---
export interface PancakeSortStep {
  array: number[];
  flipping: [number, number] | null;
  sortedIndices: number[];
}

export function* pancakeSortSteps(input: number[]): Generator<PancakeSortStep> {
  const arr = input.slice();
  const n = arr.length;
  let numSorted = 0;
  function flip(end: number) {
    let start = 0;
    while (start < end) {
      [arr[start], arr[end]] = [arr[end], arr[start]];
      start++;
      end--;
    }
  }
  for (let currSize = n; currSize > 1; currSize--) {
    let mi = 0;
    for (let i = 0; i < currSize; i++) if (arr[i] > arr[mi]) mi = i;
    if (mi !== currSize - 1) {
      flip(mi);
      yield { array: arr.slice(), flipping: [0, mi], sortedIndices: Array.from({ length: numSorted }, (_, i) => n - 1 - i) };
      flip(currSize - 1);
      yield { array: arr.slice(), flipping: [0, currSize - 1], sortedIndices: Array.from({ length: numSorted }, (_, i) => n - 1 - i) };
    }
    numSorted++;
  }
  yield { array: arr.slice(), flipping: null, sortedIndices: Array.from({ length: n }, (_, i) => i) };
}

// --- Comb Sort Step Generator ---
export interface CombSortStep {
  array: number[];
  comparing: [number, number] | null;
  sortedIndices: number[];
  swapped: boolean;
}

export function* combSortSteps(input: number[]): Generator<CombSortStep> {
  const arr = input.slice();
  const n = arr.length;
  let gap = n;
  const shrink = 1.3;
  let sorted = false;
  while (!sorted) {
    gap = Math.floor(gap / shrink);
    if (gap <= 1) {
      gap = 1;
      sorted = true;
    }
    for (let i = 0; i + gap < n; i++) {
      yield { array: arr.slice(), comparing: [i, i + gap], sortedIndices: [], swapped: false };
      if (arr[i] > arr[i + gap]) {
        [arr[i], arr[i + gap]] = [arr[i + gap], arr[i]];
        sorted = false;
        yield { array: arr.slice(), comparing: [i, i + gap], sortedIndices: [], swapped: true };
      }
    }
  }
  yield { array: arr.slice(), comparing: null, sortedIndices: Array.from({ length: n }, (_, i) => i), swapped: false };
}

// --- Odd-Even Sort Step Generator ---
export interface OddEvenSortStep {
  array: number[];
  comparing: [number, number] | null;
  sortedIndices: number[];
  swapped: boolean;
}

export function* oddEvenSortSteps(input: number[]): Generator<OddEvenSortStep> {
  const arr = input.slice();
  const n = arr.length;
  let sorted = false;
  while (!sorted) {
    sorted = true;
    for (let i = 1; i < n - 1; i += 2) {
      yield { array: arr.slice(), comparing: [i, i + 1], sortedIndices: [], swapped: false };
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        sorted = false;
        yield { array: arr.slice(), comparing: [i, i + 1], sortedIndices: [], swapped: true };
      }
    }
    for (let i = 0; i < n - 1; i += 2) {
      yield { array: arr.slice(), comparing: [i, i + 1], sortedIndices: [], swapped: false };
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        sorted = false;
        yield { array: arr.slice(), comparing: [i, i + 1], sortedIndices: [], swapped: true };
      }
    }
  }
  yield { array: arr.slice(), comparing: null, sortedIndices: Array.from({ length: n }, (_, i) => i), swapped: false };
}

// --- Shell Sort Step Generator ---
export interface ShellSortStep {
  array: number[];
  comparing: [number, number] | null;
  sortedIndices: number[];
  swapped: boolean;
}

export function* shellSortSteps(input: number[]): Generator<ShellSortStep> {
  const arr = input.slice();
  const n = arr.length;
  let gap = Math.floor(n / 2);
  while (gap > 0) {
    for (let i = gap; i < n; i++) {
      let temp = arr[i];
      let j = i;
      while (j >= gap && arr[j - gap] > temp) {
        yield { array: arr.slice(), comparing: [j, j - gap], sortedIndices: [], swapped: true };
        arr[j] = arr[j - gap];
        j -= gap;
      }
      arr[j] = temp;
      yield { array: arr.slice(), comparing: [j, i], sortedIndices: [], swapped: false };
    }
    gap = Math.floor(gap / 2);
  }
  yield { array: arr.slice(), comparing: null, sortedIndices: Array.from({ length: n }, (_, i) => i), swapped: false };
}

// --- Bitonic Sort Step Generator ---
export interface BitonicSortStep {
  array: number[];
  comparing: [number, number] | null;
  sortedIndices: number[];
  swapped: boolean;
}

export function* bitonicSortSteps(input: number[]): Generator<BitonicSortStep> {
  const arr = input.slice();
  const n = arr.length;
  function* bitonicMerge(low: number, cnt: number, dir: boolean): Generator<BitonicSortStep> {
    if (cnt > 1) {
      const k = Math.floor(cnt / 2);
      for (let i = low; i < low + k; i++) {
        yield { array: arr.slice(), comparing: [i, i + k], sortedIndices: [], swapped: false };
        if (dir === (arr[i] > arr[i + k])) {
          [arr[i], arr[i + k]] = [arr[i + k], arr[i]];
          yield { array: arr.slice(), comparing: [i, i + k], sortedIndices: [], swapped: true };
        }
      }
      yield* bitonicMerge(low, k, dir);
      yield* bitonicMerge(low + k, k, dir);
    }
  }
  function* bitonicSortHelper(low: number, cnt: number, dir: boolean): Generator<BitonicSortStep> {
    if (cnt > 1) {
      const k = Math.floor(cnt / 2);
      yield* bitonicSortHelper(low, k, true);
      yield* bitonicSortHelper(low + k, k, false);
      yield* bitonicMerge(low, cnt, dir);
    }
  }
  yield* bitonicSortHelper(0, n, true);
  yield { array: arr.slice(), comparing: null, sortedIndices: Array.from({ length: n }, (_, i) => i), swapped: false };
}

// --- Bogo Sort Step Generator ---
export interface BogoSortStep {
  array: number[];
  sortedIndices: number[];
  tries: number;
}

export function* bogoSortSteps(input: number[]): Generator<BogoSortStep> {
  function isSorted(a: number[]) {
    for (let i = 1; i < a.length; i++) if (a[i - 1] > a[i]) return false;
    return true;
  }
  const arr = input.slice();
  let tries = 0;
  while (!isSorted(arr) && tries < 10000) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    tries++;
    yield { array: arr.slice(), sortedIndices: [], tries };
  }
  yield { array: arr.slice(), sortedIndices: Array.from({ length: arr.length }, (_, i) => i), tries };
}

// --- Radix Sort Step Generator ---
export interface RadixSortStep {
  array: number[];
  digit: number;
  exp: number;
  sortedIndices: number[];
}

export function* radixSortSteps(input: number[]): Generator<RadixSortStep> {
  const arr = input.slice();
  const n = arr.length;
  const max = Math.max(...arr);
  let exp = 1;
  while (Math.floor(max / exp) > 0) {
    const output = new Array(n).fill(0);
    const count = new Array(10).fill(0);
    for (let i = 0; i < n; i++) count[Math.floor(arr[i] / exp) % 10]++;
    for (let i = 1; i < 10; i++) count[i] += count[i - 1];
    for (let i = n - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / exp) % 10;
      output[count[digit] - 1] = arr[i];
      count[digit]--;
      yield { array: arr.slice(), digit, exp, sortedIndices: [] };
    }
    for (let i = 0; i < n; i++) arr[i] = output[i];
    exp *= 10;
  }
  yield { array: arr.slice(), digit: -1, exp, sortedIndices: Array.from({ length: n }, (_, i) => i) };
}

// --- Decide Sort Step Generator (Randomized Quick Sort) ---
export interface DecideSortStep {
  array: number[];
  comparing: [number, number] | null;
  pivot: number | null;
  sortedIndices: number[];
  swapped: boolean;
}

export function* decideSortSteps(input: number[]): Generator<DecideSortStep> {
  const arr = input.slice();
  const n = arr.length;
  const sortedIndices: number[] = [];
  function* decideSortHelper(low: number, high: number): Generator<DecideSortStep> {
    if (low < high) {
      const pi = yield* partition(low, high);
      yield* decideSortHelper(low, pi - 1);
      yield* decideSortHelper(pi + 1, high);
    }
  }
  function* partition(low: number, high: number): Generator<any, number, any> {
    const randomIndex = Math.floor(Math.random() * (high - low + 1)) + low;
    [arr[randomIndex], arr[high]] = [arr[high], arr[randomIndex]];
    const pivotValue = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      yield { array: arr.slice(), comparing: [j, high], pivot: high, sortedIndices: sortedIndices.slice(), swapped: false };
      if (arr[j] < pivotValue) {
        i++;
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          yield { array: arr.slice(), comparing: [i, j], pivot: high, sortedIndices: sortedIndices.slice(), swapped: true };
        }
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    yield { array: arr.slice(), comparing: [i + 1, high], pivot: high, sortedIndices: sortedIndices.slice(), swapped: true };
    return i + 1;
  }
  yield* decideSortHelper(0, n - 1);
  yield { array: arr.slice(), comparing: null, pivot: null, sortedIndices: Array.from({ length: n }, (_, i) => i), swapped: false };
}

// --- Salt Shaker Sort (Shaker/Cocktail Sort) Step Generator ---
export interface SaltShakerSortStep {
  array: number[];
  comparing: [number, number] | null;
  sortedIndices: number[];
  swapped: boolean;
}

export function* saltShakerSortSteps(input: number[]): Generator<SaltShakerSortStep> {
  const arr = input.slice();
  const n = arr.length;
  let left = 0, right = n - 1;
  let swapped = true;
  while (swapped) {
    swapped = false;
    for (let i = left; i < right; i++) {
      yield { array: arr.slice(), comparing: [i, i + 1], sortedIndices: [], swapped: false };
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
        yield { array: arr.slice(), comparing: [i, i + 1], sortedIndices: [], swapped: true };
      }
    }
    right--;
    for (let i = right; i > left; i--) {
      yield { array: arr.slice(), comparing: [i - 1, i], sortedIndices: [], swapped: false };
      if (arr[i - 1] > arr[i]) {
        [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
        swapped = true;
        yield { array: arr.slice(), comparing: [i - 1, i], sortedIndices: [], swapped: true };
      }
    }
    left++;
  }
  yield { array: arr.slice(), comparing: null, sortedIndices: Array.from({ length: n }, (_, i) => i), swapped: false };
}

// --- Jump Search Step Generator ---
export interface JumpSearchStep {
  array: number[];
  current: number;
  found: number | null;
  target: number;
  path: number[];
}

export function* jumpSearchSteps(input: number[], target: number): Generator<JumpSearchStep> {
  const arr = input.slice().sort((a, b) => a - b);
  const n = arr.length;
  let step = Math.floor(Math.sqrt(n));
  let prev = 0;
  const path: number[] = [];
  while (prev < n && arr[Math.min(step, n) - 1] < target) {
    path.push(Math.min(step, n) - 1);
    yield { array: arr.slice(), current: Math.min(step, n) - 1, found: null, target, path: path.slice() };
    prev = step;
    step += Math.floor(Math.sqrt(n));
    if (prev >= n) {
      yield { array: arr.slice(), current: -1, found: null, target, path: path.slice() };
      return;
    }
  }
  while (prev < Math.min(step, n)) {
    path.push(prev);
    if (arr[prev] === target) {
      yield { array: arr.slice(), current: prev, found: prev, target, path: path.slice() };
      return;
    }
    yield { array: arr.slice(), current: prev, found: null, target, path: path.slice() };
    prev++;
  }
  yield { array: arr.slice(), current: -1, found: null, target, path: path.slice() };
}

// --- Interpolation Search Step Generator ---
export interface InterpolationSearchStep {
  array: number[];
  low: number;
  high: number;
  pos: number;
  found: number | null;
  target: number;
  path: number[];
}

export function* interpolationSearchSteps(input: number[], target: number): Generator<InterpolationSearchStep> {
  const arr = input.slice().sort((a, b) => a - b);
  let low = 0, high = arr.length - 1;
  const path: number[] = [];
  while (low <= high && target >= arr[low] && target <= arr[high]) {
    if (low === high) {
      if (arr[low] === target) {
        path.push(low);
        yield { array: arr.slice(), low, high, pos: low, found: low, target, path: path.slice() };
        return;
      }
      break;
    }
    const pos = low + Math.floor(((high - low) / (arr[high] - arr[low])) * (target - arr[low]));
    path.push(pos);
    if (arr[pos] === target) {
      yield { array: arr.slice(), low, high, pos, found: pos, target, path: path.slice() };
      return;
    }
    yield { array: arr.slice(), low, high, pos, found: null, target, path: path.slice() };
    if (arr[pos] < target) low = pos + 1;
    else high = pos - 1;
  }
  yield { array: arr.slice(), low, high, pos: -1, found: null, target, path: path.slice() };
}

// --- Exponential Search Step Generator ---
export interface ExponentialSearchStep {
  array: number[];
  current: number;
  found: number | null;
  target: number;
  path: number[];
  left: number;
  right: number;
  mid: number;
}

export function* exponentialSearchSteps(input: number[], target: number): Generator<ExponentialSearchStep> {
  const arr = input.slice().sort((a, b) => a - b);
  const n = arr.length;
  const path: number[] = [];
  if (arr[0] === target) {
    path.push(0);
    yield { array: arr.slice(), current: 0, found: 0, target, path: path.slice(), left: 0, right: 0, mid: 0 };
    return;
  }
  let i = 1;
  while (i < n && arr[i] <= target) {
    path.push(i);
    yield { array: arr.slice(), current: i, found: null, target, path: path.slice(), left: 0, right: 0, mid: 0 };
    i *= 2;
  }
  let left = Math.floor(i / 2);
  let right = Math.min(i, n - 1);
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    path.push(mid);
    if (arr[mid] === target) {
      yield { array: arr.slice(), current: mid, found: mid, target, path: path.slice(), left, right, mid };
      return;
    }
    yield { array: arr.slice(), current: mid, found: null, target, path: path.slice(), left, right, mid };
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  yield { array: arr.slice(), current: -1, found: null, target, path: path.slice(), left, right, mid: -1 };
}

// --- Fibonacci Search Step Generator ---
export interface FibonacciSearchStep {
  array: number[];
  current: number;
  found: number | null;
  target: number;
  path: number[];
}

export function* fibonacciSearchSteps(input: number[], target: number): Generator<FibonacciSearchStep> {
  const arr = input.slice().sort((a, b) => a - b);
  const n = arr.length;
  let fibMMm2 = 0, fibMMm1 = 1, fibM = fibMMm2 + fibMMm1;
  const path: number[] = [];
  while (fibM < n) {
    fibMMm2 = fibMMm1;
    fibMMm1 = fibM;
    fibM = fibMMm2 + fibMMm1;
  }
  let offset = -1;
  while (fibM > 1) {
    const i = Math.min(offset + fibMMm2, n - 1);
    path.push(i);
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
      yield { array: arr.slice(), current: i, found: i, target, path: path.slice() };
      return;
    }
    yield { array: arr.slice(), current: i, found: null, target, path: path.slice() };
  }
  if (fibMMm1 && offset + 1 < n && arr[offset + 1] === target) {
    path.push(offset + 1);
    yield { array: arr.slice(), current: offset + 1, found: offset + 1, target, path: path.slice() };
    return;
  }
  yield { array: arr.slice(), current: -1, found: null, target, path: path.slice() };
} 