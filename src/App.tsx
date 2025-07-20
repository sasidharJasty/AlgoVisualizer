import React, { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
import {
  bubbleSortSteps, BubbleSortStep,
  selectionSortSteps, SelectionSortStep,
  insertionSortSteps, InsertionSortStep,
  mergeSortSteps, MergeSortStep,
  quickSortSteps, QuickSortStep,
  heapSortSteps, HeapSortStep,
  gnomeSortSteps, GnomeSortStep,
  pancakeSortSteps, PancakeSortStep,
  combSortSteps, CombSortStep,
  oddEvenSortSteps, OddEvenSortStep,
  shellSortSteps, ShellSortStep,
  bitonicSortSteps, BitonicSortStep,
  bogoSortSteps, BogoSortStep,
  radixSortSteps, RadixSortStep,
  decideSortSteps, DecideSortStep,
  saltShakerSortSteps, SaltShakerSortStep,
  linearSearchSteps, LinearSearchStep,
  binarySearchSteps, BinarySearchStep,
  jumpSearchSteps, JumpSearchStep,
  interpolationSearchSteps, InterpolationSearchStep,
  exponentialSearchSteps, ExponentialSearchStep,
  fibonacciSearchSteps, FibonacciSearchStep
} from './visualAlgorithms';

// Add a type for Bar
interface Bar {
  id: number;
  value: number;
}

// Algorithm options
const sortingAlgorithms = [
  { value: 'bubble', label: 'Bubble Sort' },
  { value: 'selection', label: 'Selection Sort' },
  { value: 'insertion', label: 'Insertion Sort' },
  { value: 'merge', label: 'Merge Sort' },
  { value: 'quick', label: 'Quick Sort' },
  { value: 'heap', label: 'Heap Sort' },
  { value: 'gnome', label: 'Gnome Sort' },
  { value: 'pancake', label: 'Pancake Sort' },
  { value: 'comb', label: 'Comb Sort' },
  { value: 'oddEven', label: 'Odd-Even Sort' },
  { value: 'shell', label: 'Shell Sort' },
  { value: 'bitonic', label: 'Bitonic Sort' },
  { value: 'bogo', label: 'Bogo Sort' },
  { value: 'radix', label: 'Radix Sort' },
  { value: 'decide', label: 'Decide Sort' },
  { value: 'saltShaker', label: 'Salt Shaker Sort' },
];
const searchingAlgorithms = [
  { value: 'linear', label: 'Linear Search' },
  { value: 'binary', label: 'Binary Search' },
  { value: 'jump', label: 'Jump Search' },
  { value: 'interpolation', label: 'Interpolation Search' },
  { value: 'exponential', label: 'Exponential Search' },
  { value: 'fibonacci', label: 'Fibonacci Search' },
];

// Algorithm descriptions and pseudocode
const algorithmInfo = {
  bubble: {
    desc: 'Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    pseudo: `for i = 0 to n-1
  for j = 0 to n-i-2
    if arr[j] > arr[j+1]
      swap arr[j], arr[j+1]`
  },
  selection: {
    desc: 'Selection Sort repeatedly selects the minimum element from the unsorted part and puts it at the beginning.',
    pseudo: `for i = 0 to n-2
  minIdx = i
  for j = i+1 to n-1
    if arr[j] < arr[minIdx]
      minIdx = j
  swap arr[i], arr[minIdx]`
  },
  insertion: {
    desc: 'Insertion Sort builds the sorted array one item at a time by inserting elements into their correct position.',
    pseudo: `for i = 1 to n-1
  key = arr[i]
  j = i-1
  while j >= 0 and arr[j] > key
    arr[j+1] = arr[j]
    j--
  arr[j+1] = key`
  },
  merge: {
    desc: 'Merge Sort divides the array into halves, sorts them and merges them back together.',
    pseudo: `mergeSort(arr, l, r):
  if l < r
    m = (l+r)//2
    mergeSort(arr, l, m)
    mergeSort(arr, m+1, r)
    merge(arr, l, m, r)`
  },
  quick: {
    desc: 'Quick Sort picks a pivot and partitions the array around the pivot, recursively sorting the partitions.',
    pseudo: `quickSort(arr, low, high):
  if low < high
    pi = partition(arr, low, high)
    quickSort(arr, low, pi-1)
    quickSort(arr, pi+1, high)`
  },
  heap: {
    desc: 'Heap Sort builds a max heap and repeatedly extracts the maximum element.',
    pseudo: `heapSort(arr):
  build max heap
  for i = n-1 downto 1
    swap arr[0], arr[i]
    heapify(arr, 0, i)`
  },
  gnome: {
    desc: 'Gnome Sort moves elements to their correct position by swapping them backward as needed.',
    pseudo: `i = 0
while i < n
  if i == 0 or arr[i] >= arr[i-1]
    i++
  else
    swap arr[i], arr[i-1]
    i--`
  },
  pancake: {
    desc: 'Pancake Sort repeatedly flips the largest unsorted element to the front, then to its correct position.',
    pseudo: `for currSize = n downto 2
  mi = index of max in arr[0..currSize-1]
  if mi != currSize-1
    flip arr[0..mi]
    flip arr[0..currSize-1]`
  },
  comb: {
    desc: 'Comb Sort improves on Bubble Sort by using a gap sequence to compare elements.',
    pseudo: `gap = n, shrink = 1.3
while gap > 1 or swapped
  gap = max(1, int(gap/shrink))
  for i = 0 to n-gap-1
    if arr[i] > arr[i+gap]
      swap arr[i], arr[i+gap]`
  },
  oddEven: {
    desc: 'Odd-Even Sort is a variation of Bubble Sort that compares odd and even indexed pairs alternately.',
    pseudo: `sorted = false
while not sorted
  sorted = true
  for i = 1 to n-2 step 2
    if arr[i] > arr[i+1]
      swap arr[i], arr[i+1]
      sorted = false
  for i = 0 to n-2 step 2
    if arr[i] > arr[i+1]
      swap arr[i], arr[i+1]
      sorted = false`
  },
  shell: {
    desc: 'Shell Sort sorts elements far apart from each other and successively reduces the gap.',
    pseudo: `gap = n//2
while gap > 0
  for i = gap to n-1
    temp = arr[i]
    j = i
    while j >= gap and arr[j-gap] > temp
      arr[j] = arr[j-gap]
      j -= gap
    arr[j] = temp
  gap //= 2`
  },
  bitonic: {
    desc: 'Bitonic Sort is a parallel algorithm for sorting that works by recursively sorting bitonic sequences.',
    pseudo: `bitonicSort(arr, low, cnt, dir):
  if cnt > 1
    k = cnt/2
    bitonicSort(arr, low, k, 1)
    bitonicSort(arr, low+k, k, 0)
    bitonicMerge(arr, low, cnt, dir)`
  },
  bogo: {
    desc: 'Bogo Sort shuffles the array until it is sorted. Highly inefficient.',
    pseudo: `while not isSorted(arr)
  shuffle(arr)`
  },
  radix: {
    desc: 'Radix Sort sorts numbers by processing individual digits.',
    pseudo: `for exp = 1; max/exp > 0; exp *= 10
  countSort(arr, exp)`
  },
  decide: {
    desc: 'Decide Sort is a randomized version of Quick Sort.',
    pseudo: `decideSort(arr, low, high):
  if low < high
    pi = randomPartition(arr, low, high)
    decideSort(arr, low, pi-1)
    decideSort(arr, pi+1, high)`
  },
  saltShaker: {
    desc: 'Salt Shaker (Shaker/Cocktail) Sort is a bidirectional Bubble Sort.',
    pseudo: `left = 0, right = n-1, swapped = true
while swapped
  swapped = false
  for i = left to right-1
    if arr[i] > arr[i+1]
      swap arr[i], arr[i+1]
      swapped = true
  right--
  for i = right to left+1 step -1
    if arr[i] < arr[i-1]
      swap arr[i], arr[i-1]
      swapped = true
  left++`
  },
  linear: {
    desc: 'Linear Search checks each element until the target is found.',
    pseudo: `for i = 0 to n-1
  if arr[i] == target
    return i
return -1`
  },
  binary: {
    desc: 'Binary Search repeatedly divides the sorted array in half to find the target.',
    pseudo: `left = 0, right = n-1
while left <= right
  mid = (left+right)//2
  if arr[mid] == target
    return mid
  else if arr[mid] < target
    left = mid+1
  else
    right = mid-1
return -1`
  },
  jump: {
    desc: 'Jump Search checks elements at fixed intervals and then does a linear search.',
    pseudo: `step = sqrt(n), prev = 0
while arr[min(step, n)-1] < target
  prev = step
  step += sqrt(n)
  if prev >= n
    return -1
while arr[prev] < target
  prev++
  if prev == min(step, n)
    return -1
if arr[prev] == target
  return prev
return -1`
  },
  interpolation: {
    desc: 'Interpolation Search estimates the position of the target based on value.',
    pseudo: `low = 0, high = n-1
while low <= high and target >= arr[low] and target <= arr[high]
  pos = low + ((high-low) // (arr[high]-arr[low])) * (target-arr[low])
  if arr[pos] == target
    return pos
  if arr[pos] < target
    low = pos+1
  else
    high = pos-1
return -1`
  },
  exponential: {
    desc: 'Exponential Search finds the range where the target may be and then does binary search.',
    pseudo: `if arr[0] == target
  return 0
i = 1
while i < n and arr[i] <= target
  i *= 2
return binarySearch(arr, i//2, min(i, n-1), target)`
  },
  fibonacci: {
    desc: 'Fibonacci Search uses Fibonacci numbers to divide the array for searching.',
    pseudo: `fibMMm2 = 0, fibMMm1 = 1, fibM = fibMMm2 + fibMMm1
while fibM < n
  fibMMm2 = fibMMm1
  fibMMm1 = fibM
  fibM = fibMMm2 + fibMMm1
offset = -1
while fibM > 1
  i = min(offset+fibMMm2, n-1)
  if arr[i] < target
    fibM = fibMMm1
    fibMMm1 = fibMMm2
    fibMMm2 = fibM - fibMMm1
    offset = i
  else if arr[i] > target
    fibM = fibMMm2
    fibMMm1 = fibMMm1 - fibMMm2
    fibMMm2 = fibM - fibMMm1
  else
    return i
if fibMMm1 and arr[offset+1] == target
  return offset+1
return -1`
  },
};

// Analytics state
function getInitialAnalytics() {
  return { comparisons: 0, swaps: 0, time: 0 };
}

// Color palette for states
const COLORS = {
  normal: '#64748b',
  comparing: '#3b82f6',
  swapped: '#f59e42',
  sorted: '#22c55e',
  pivot: '#a21caf',
  merging: '#a78bfa',
  current: '#fbbf24',
  found: '#16a34a',
  path: '#0ea5e9',
  min: '#e11d48',
  max: '#f43f5e',
  left: '#6366f1',
  right: '#f472b6',
};

// Legend definitions for each algorithm
const LEGEND = {
  bubble: [
    { label: 'Normal', color: COLORS.normal },
    { label: 'Comparing', color: COLORS.comparing },
    { label: 'Swapped', color: COLORS.swapped },
    { label: 'Sorted', color: COLORS.sorted },
  ],
  selection: [
    { label: 'Normal', color: COLORS.normal },
    { label: 'Comparing', color: COLORS.comparing },
    { label: 'Min', color: COLORS.min },
    { label: 'Swapped', color: COLORS.swapped },
    { label: 'Sorted', color: COLORS.sorted },
  ],
  insertion: [
    { label: 'Normal', color: COLORS.normal },
    { label: 'Current', color: COLORS.current },
    { label: 'Comparing', color: COLORS.comparing },
    { label: 'Swapped', color: COLORS.swapped },
    { label: 'Sorted', color: COLORS.sorted },
  ],
  merge: [
    { label: 'Normal', color: COLORS.normal },
    { label: 'Merging', color: COLORS.merging },
    { label: 'Sorted', color: COLORS.sorted },
  ],
  quick: [
    { label: 'Normal', color: COLORS.normal },
    { label: 'Comparing', color: COLORS.comparing },
    { label: 'Swapped', color: COLORS.swapped },
    { label: 'Pivot', color: COLORS.pivot },
    { label: 'Sorted', color: COLORS.sorted },
  ],
  heap: [
    { label: 'Normal', color: COLORS.normal },
    { label: 'Comparing', color: COLORS.comparing },
    { label: 'Swapped', color: COLORS.swapped },
    { label: 'Sorted', color: COLORS.sorted },
  ],
  radix: [
    { label: 'Normal', color: COLORS.normal },
    { label: 'Digit', color: COLORS.comparing },
    { label: 'Sorted', color: COLORS.sorted },
  ],
  gnome: [
    { label: 'Normal', color: COLORS.normal },
    { label: 'Comparing', color: COLORS.comparing },
    { label: 'Swapped', color: COLORS.swapped },
    { label: 'Sorted', color: COLORS.sorted },
  ],
  pancake: [
    { label: 'Normal', color: COLORS.normal },
    { label: 'Flipping', color: COLORS.swapped },
    { label: 'Sorted', color: COLORS.sorted },
  ],
  comb: [
    { label: 'Normal', color: COLORS.normal },
    { label: 'Comparing', color: COLORS.comparing },
    { label: 'Swapped', color: COLORS.swapped },
    { label: 'Sorted', color: COLORS.sorted },
  ],
  oddEven: [
    { label: 'Normal', color: COLORS.normal },
    { label: 'Comparing', color: COLORS.comparing },
    { label: 'Swapped', color: COLORS.swapped },
    { label: 'Sorted', color: COLORS.sorted },
  ],
  shell: [
    { label: 'Normal', color: COLORS.normal },
    { label: 'Comparing', color: COLORS.comparing },
    { label: 'Swapped', color: COLORS.swapped },
    { label: 'Sorted', color: COLORS.sorted },
  ],
  bitonic: [
    { label: 'Normal', color: COLORS.normal },
    { label: 'Comparing', color: COLORS.comparing },
    { label: 'Swapped', color: COLORS.swapped },
    { label: 'Sorted', color: COLORS.sorted },
  ],
  bogo: [
    { label: 'Normal', color: COLORS.normal },
    { label: 'Sorted', color: COLORS.sorted },
  ],
  decide: [
    { label: 'Normal', color: COLORS.normal },
    { label: 'Comparing', color: COLORS.comparing },
    { label: 'Swapped', color: COLORS.swapped },
    { label: 'Pivot', color: COLORS.pivot },
    { label: 'Sorted', color: COLORS.sorted },
  ],
  saltShaker: [
    { label: 'Normal', color: COLORS.normal },
    { label: 'Comparing', color: COLORS.comparing },
    { label: 'Swapped', color: COLORS.swapped },
    { label: 'Sorted', color: COLORS.sorted },
  ],
  linear: [
    { label: 'Normal', color: COLORS.normal },
    { label: 'Current', color: COLORS.current },
    { label: 'Found', color: COLORS.found },
    { label: 'Path', color: COLORS.path },
  ],
  binary: [
    { label: 'Normal', color: COLORS.normal },
    { label: 'Current', color: COLORS.current },
    { label: 'Found', color: COLORS.found },
    { label: 'Path', color: COLORS.path },
    { label: 'Left', color: COLORS.left },
    { label: 'Right', color: COLORS.right },
  ],
  jump: [
    { label: 'Normal', color: COLORS.normal },
    { label: 'Current', color: COLORS.current },
    { label: 'Found', color: COLORS.found },
    { label: 'Path', color: COLORS.path },
  ],
  interpolation: [
    { label: 'Normal', color: COLORS.normal },
    { label: 'Current', color: COLORS.current },
    { label: 'Found', color: COLORS.found },
    { label: 'Path', color: COLORS.path },
  ],
  exponential: [
    { label: 'Normal', color: COLORS.normal },
    { label: 'Current', color: COLORS.current },
    { label: 'Found', color: COLORS.found },
    { label: 'Path', color: COLORS.path },
  ],
  fibonacci: [
    { label: 'Normal', color: COLORS.normal },
    { label: 'Current', color: COLORS.current },
    { label: 'Found', color: COLORS.found },
    { label: 'Path', color: COLORS.path },
  ],
};

// Helper to get the next power of two
function nextPowerOfTwo(n: number): number {
  return Math.pow(2, Math.ceil(Math.log2(n)));
}

// Helper to generate a unique id
let globalBarId = 0;
function getUniqueBarId() {
  return ++globalBarId;
}

const App: React.FC = () => {
  // Mode and algorithm selection
  const [mode, setMode] = useState<'sort' | 'search'>('sort');
  const [algorithm, setAlgorithm] = useState<string>('bubble');
  // Change array to Bar[]
  const [array, setArray] = useState<Bar[]>([]);
  const [arraySize, setArraySize] = useState<number>(30);
  const [steps, setSteps] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(50);
  const [searchTarget, setSearchTarget] = useState<number>(50);
  const [analytics, setAnalytics] = useState(getInitialAnalytics());
  const [startTime, setStartTime] = useState<number | null>(null);
  const playRef = useRef(isPlaying);
  const [bitonicWarning, setBitonicWarning] = useState<string | null>(null);

  // Generate a random array of Bar objects with unique ids
  function generateArray(size: number): Bar[] {
    const arr: Bar[] = [];
    for (let i = 0; i < size; i++) {
      arr.push({ id: getUniqueBarId(), value: Math.floor(Math.random() * 490) + 10 });
    }
    return arr;
  }

  // Shuffle array (swap entire bar objects)
  function shuffleArray(arr: Bar[]): Bar[] {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Convert Bar[] to number[] for step generators
  function barsToValues(bars: Bar[]): number[] {
    return bars.map(b => b.value);
  }

  // Convert number[] to Bar[] with persistent ids, handling duplicates
  function valuesToBars(values: number[], prevBars: Bar[]): Bar[] {
    // Map from value to a queue of ids
    const valueToIds = new Map<number, number[]>();
    for (const bar of prevBars) {
      if (!valueToIds.has(bar.value)) valueToIds.set(bar.value, []);
      valueToIds.get(bar.value)!.push(bar.id);
    }
    const used = new Map<number, number>();
    return values.map(v => {
      const usedCount = used.get(v) || 0;
      const ids = valueToIds.get(v) || [];
      if (usedCount < ids.length) {
        used.set(v, usedCount + 1);
        return { id: ids[usedCount], value: v };
      }
      // fallback: new id
      return { id: getUniqueBarId(), value: v };
    });
  }

  // Build steps for the selected algorithm
  function buildSteps(arr: Bar[], target: number): any[] {
    const values = barsToValues(arr);
    const gen = getStepGenerator(mode, algorithm, values, target);
    const allSteps: any[] = [];
    let prevBars = arr;
    for (const step of gen) {
      // For each step, convert step.array (number[]) to Bar[] with persistent ids
      const bars = valuesToBars(step.array, prevBars);
      allSteps.push({ ...step, bars });
      prevBars = bars;
    }
    return allSteps;
  }

  // Helper to pick a random value from the array
  function pickRandomTarget(arr: Bar[]): number {
    if (arr.length === 0) return 0;
    return arr[Math.floor(Math.random() * arr.length)].value;
  }

  // Helper to insert a value into the array at a random position if not present
  function ensureValueInArray(arr: Bar[], value: number): Bar[] {
    if (arr.some(bar => bar.value === value)) return arr;
    // Insert at a random position
    const idx = Math.floor(Math.random() * (arr.length + 1));
    const newBar = { id: getUniqueBarId(), value };
    const newArr = arr.slice();
    newArr.splice(idx, 0, newBar);
    return newArr;
  }

  // On mount or array size/algorithm/mode/target change, generate array and steps
  useEffect(() => {
    let arr = generateArray(arraySize);
    let t = searchTarget;
    if (mode === 'search') {
      t = pickRandomTarget(arr);
      setSearchTarget(t);
      arr = ensureValueInArray(arr, t);
      setArray(arr);
    } else {
      setArray(arr);
    }
    const s = buildSteps(arr, t);
    setSteps(s);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [arraySize, algorithm, mode]);

  // On algorithm or mode change, if Bitonic Sort, adjust array size to power of two
  useEffect(() => {
    if (algorithm === 'bitonic' && mode === 'sort') {
      const pow2 = nextPowerOfTwo(arraySize);
      if (arraySize !== pow2) {
        setBitonicWarning(`Bitonic Sort requires array size to be a power of two. Adjusted to ${pow2}.`);
        setArraySize(pow2);
        return;
      } else {
        setBitonicWarning(null);
      }
    } else {
      setBitonicWarning(null);
    }
  }, [algorithm, mode, arraySize]);

  // Play/Pause effect
  useEffect(() => {
    playRef.current = isPlaying;
    if (isPlaying) {
      if (currentStep >= steps.length - 1) {
        setIsPlaying(false);
        return;
      }
      const timer = setTimeout(() => {
        if (playRef.current && currentStep < steps.length - 1) {
          setCurrentStep((s) => s + 1);
        } else {
          setIsPlaying(false);
        }
      }, Math.max(10, 200 - speed));
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentStep, steps.length, speed]);

  // Update array on step change
  useEffect(() => {
    if (steps.length > 0) {
      setArray(steps[currentStep].bars);
    }
  }, [currentStep, steps]);

  // Track analytics during playback
  useEffect(() => {
    if (steps.length === 0) return;
    let comparisons = 0, swaps = 0;
    for (let i = 0; i <= currentStep; i++) {
      const s = steps[i];
      if (s.comparing) comparisons++;
      if (s.swapped) swaps++;
    }
    setAnalytics(a => ({ ...a, comparisons, swaps }));
  }, [currentStep, steps]);

  // Track time elapsed
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      if (startTime === null) setStartTime(Date.now());
      timer = setInterval(() => {
        setAnalytics(a => ({ ...a, time: startTime ? Math.floor((Date.now() - startTime) / 1000) : 0 }));
      }, 200);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isPlaying, startTime]);

  // Reset analytics and timer on reset/shuffle/algorithm change
  useEffect(() => {
    setAnalytics(getInitialAnalytics());
    setStartTime(null);
  }, [arraySize, algorithm, mode, currentStep === 0]);

  // Controls
  const handlePlay = () => {
    if (currentStep >= steps.length - 1) return;
    setIsPlaying(true);
  };
  const handlePause = () => setIsPlaying(false);
  const handleStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1);
  };
  const handleReset = () => {
    let arr = generateArray(arraySize);
    let t = searchTarget;
    if (mode === 'search') {
      t = pickRandomTarget(arr);
      setSearchTarget(t);
      arr = ensureValueInArray(arr, t);
      setArray(arr);
    } else {
      setArray(arr);
    }
    const s = buildSteps(arr, t);
    setSteps(s);
    setCurrentStep(0);
    setIsPlaying(false);
  };
  const handleShuffle = () => {
    let arr = shuffleArray(array);
    let t = searchTarget;
    if (mode === 'search') {
      t = pickRandomTarget(arr);
      setSearchTarget(t);
      arr = ensureValueInArray(arr, t);
      setArray(arr);
    } else {
      setArray(arr);
    }
    const s = buildSteps(arr, t);
    setSteps(s);
    setCurrentStep(0);
    setIsPlaying(false);
  };
  const handleArraySizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArraySize(Number(e.target.value));
  };
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(Number(e.target.value));
  };
  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMode(e.target.value as 'sort' | 'search');
    setAlgorithm(e.target.value === 'sort' ? 'bubble' : 'linear');
  };
  const handleAlgorithmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAlgorithm(e.target.value);
  };
  const handleSearchTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = Number(e.target.value);
    let arr = array;
    if (!arr.some(bar => bar.value === val)) {
      arr = ensureValueInArray(arr, val);
      setArray(arr);
    }
    setSearchTarget(val);
    const s = buildSteps(arr, val);
    setSteps(s);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  // Helper to get the correct generator for the selected algorithm
  function getStepGenerator(mode: 'sort' | 'search', algo: string, arr: number[], target: number) {
    switch (mode) {
      case 'sort':
        switch (algo) {
          case 'bubble': return bubbleSortSteps(arr);
          case 'selection': return selectionSortSteps(arr);
          case 'insertion': return insertionSortSteps(arr);
          case 'merge': return mergeSortSteps(arr);
          case 'quick': return quickSortSteps(arr);
          case 'heap': return heapSortSteps(arr);
          case 'gnome': return gnomeSortSteps(arr);
          case 'pancake': return pancakeSortSteps(arr);
          case 'comb': return combSortSteps(arr);
          case 'oddEven': return oddEvenSortSteps(arr);
          case 'shell': return shellSortSteps(arr);
          case 'bitonic': return bitonicSortSteps(arr);
          case 'bogo': return bogoSortSteps(arr);
          case 'radix': return radixSortSteps(arr);
          case 'decide': return decideSortSteps(arr);
          case 'saltShaker': return saltShakerSortSteps(arr);
          default: return bubbleSortSteps(arr);
        }
      case 'search':
        switch (algo) {
          case 'linear': return linearSearchSteps(arr, target);
          case 'binary': return binarySearchSteps(arr, target);
          case 'jump': return jumpSearchSteps(arr, target);
          case 'interpolation': return interpolationSearchSteps(arr, target);
          case 'exponential': return exponentialSearchSteps(arr, target);
          case 'fibonacci': return fibonacciSearchSteps(arr, target);
          default: return linearSearchSteps(arr, target);
        }
      default:
        return bubbleSortSteps(arr);
    }
  }

  // Enhanced getBarColor for all algorithms and states
  function getBarColor(idx: number, step: any, mode: string, algorithm: string): string {
    if (!step) return COLORS.normal;
    // Sorting
    if (mode === 'sort') {
      if (step.sortedIndices && step.sortedIndices.includes(idx)) return COLORS.sorted;
      if (algorithm === 'selection' && step.minIndex === idx) return COLORS.min;
      if (algorithm === 'insertion') {
        if (typeof step.current === 'number' && step.current === idx) return COLORS.current;
        if (step.comparing && step.comparing.includes(idx)) {
          if (step.swapped) return COLORS.swapped;
          return COLORS.comparing;
        }
      }
      if (algorithm === 'pancake' && step.flipping && step.flipping.includes(idx)) return COLORS.swapped;
      if (algorithm === 'merge' && step.merging && idx >= step.merging[0] && idx <= step.merging[1]) return COLORS.merging;
      if ((algorithm === 'quick' || algorithm === 'decide') && step.pivot === idx) return COLORS.pivot;
      if (step.comparing && step.comparing.includes(idx)) {
        if (step.swapped) return COLORS.swapped;
        return COLORS.comparing;
      }
      return COLORS.normal;
    }
    // Searching
    if (mode === 'search') {
      if (step.found === idx) return COLORS.found;
      if (step.current === idx) return COLORS.current;
      if (step.path && step.path.includes(idx)) return COLORS.path;
      if (algorithm === 'binary') {
        if (step.left === idx) return COLORS.left;
        if (step.right === idx) return COLORS.right;
      }
      return COLORS.normal;
    }
    return COLORS.normal;
  }

  // Current step info
  const step = steps[currentStep] || null;

  // Collector Card UI for analytics, description, pseudocode
  const algoKey = algorithm;
  const info = algorithmInfo[algoKey] || { desc: '', pseudo: '' };

  // In the visualization section, make the bars fill the full width
  // Calculate bar width based on container width and array length
  // Use a ref to get the container width
  const visRef = useRef<HTMLDivElement>(null);
  const [visWidth, setVisWidth] = useState<number>(800);
  useEffect(() => {
    function updateWidth() {
      if (visRef.current) {
        setVisWidth(visRef.current.offsetWidth);
      }
    }
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);
  const barWidth = Math.max(1, Math.floor((visWidth - 2 * array.length) / array.length));

  // Legend icon mapping
  const LEGEND_ICONS: Record<string, string> = {
    Normal: '⬜️',
    Comparing: '🔄',
    Swapped: '↔️',
    Sorted: '✅',
    Pivot: '🎯',
    Merging: '🟪',
    Current: '🔎',
    Found: '✔️',
    Path: '🟦',
    Min: '🔻',
    Max: '🔺',
    Left: '⬅️',
    Right: '➡️',
    Flipping: '🔃',
    Digit: '🔢',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#222', fontFamily: 'Inter, sans-serif' }}>
      <header style={{ padding: '2rem 0', textAlign: 'center', background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.03em', color: '#2563eb' }}>Algorithm Visualizer</h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: 8 }}>Step-by-step, interactive, and colorful!</p>
      </header>
      {/* Bitonic warning */}
      {bitonicWarning && (
        <div style={{ background: '#fef3c7', color: '#b45309', border: '1.5px solid #f59e42', borderRadius: 8, padding: '12px 24px', margin: '16px auto', maxWidth: 600, textAlign: 'center', fontWeight: 600 }}>
          {bitonicWarning}
        </div>
      )}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Mode and Algorithm Selection */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 32, alignItems: 'center', justifyContent: 'center' }}>
          <div>
            <label style={{ fontWeight: 500, color: '#2563eb' }}>Mode</label><br />
            <select value={mode} onChange={handleModeChange} style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', minWidth: 120, fontSize: 16 }}>
              <option value="sort">Sorting</option>
              <option value="search">Searching</option>
            </select>
          </div>
          <div>
            <label style={{ fontWeight: 500, color: '#2563eb' }}>Algorithm</label><br />
            <select value={algorithm} onChange={handleAlgorithmChange} style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', minWidth: 180, fontSize: 16 }}>
              {(mode === 'sort' ? sortingAlgorithms : searchingAlgorithms).map(algo => (
                <option key={algo.value} value={algo.value}>{algo.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontWeight: 500, color: '#2563eb' }}>Array Size: {arraySize}</label><br />
            <input type="range" min={5} max={100} value={arraySize} onChange={handleArraySizeChange} style={{ width: 180 }} />
          </div>
          <div>
            <label style={{ fontWeight: 500, color: '#2563eb' }}>Speed: {speed}</label><br />
            <input type="range" min={10} max={190} value={speed} onChange={handleSpeedChange} style={{ width: 180 }} />
          </div>
          {mode === 'search' && (
            <div>
              <label style={{ fontWeight: 500, color: '#2563eb' }}>Search Target: {searchTarget}</label><br />
              <input type="number" min={10} max={500} value={searchTarget} onChange={handleSearchTargetChange} style={{ width: 100, padding: 6, borderRadius: 6, border: '1px solid #cbd5e1' }} />
            </div>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handlePlay} disabled={isPlaying || currentStep >= steps.length - 1} style={{ padding: '0.5rem 1.5rem', borderRadius: 8, background: '#22c55e', color: '#fff', fontWeight: 600, border: 'none', fontSize: 16 }}>Play</button>
            <button onClick={handlePause} disabled={!isPlaying} style={{ padding: '0.5rem 1.5rem', borderRadius: 8, background: '#fbbf24', color: '#fff', fontWeight: 600, border: 'none', fontSize: 16 }}>Pause</button>
            <button onClick={handleStep} disabled={isPlaying || currentStep >= steps.length - 1} style={{ padding: '0.5rem 1.5rem', borderRadius: 8, background: '#3b82f6', color: '#fff', fontWeight: 600, border: 'none', fontSize: 16 }}>Step</button>
            <button onClick={handleReset} style={{ padding: '0.5rem 1.5rem', borderRadius: 8, background: '#64748b', color: '#fff', fontWeight: 600, border: 'none', fontSize: 16 }}>Reset</button>
            <button onClick={handleShuffle} style={{ padding: '0.5rem 1.5rem', borderRadius: 8, background: '#2563eb', color: '#fff', fontWeight: 600, border: 'none', fontSize: 16 }}>Shuffle</button>
          </div>
        </div>
        {/* Array Visualization */}
        <section style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px #e0e7ef33', marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#2563eb', marginBottom: 16 }}>Array Visualization</h2>
          <div ref={visRef} style={{ width: '100%', display: 'flex', alignItems: 'flex-end', height: 320, gap: 2, overflowX: 'hidden', borderBottom: '1px solid #e5e7eb', paddingBottom: 16, transition: 'all 0.2s' }}>
            {array.map((bar, idx) => (
              <div
                key={bar.id}
                style={{
                  width: `${barWidth}px`,
                  height: `${(bar.value / 500) * 300}px`,
                  background: getBarColor(idx, step, mode, algorithm) || '#64748b',
                  borderRadius: '4px 4px 0 0',
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  transition: 'height 0.2s, background 0.2s',
                  position: 'relative',
                  zIndex: step && step.found === bar.id ? 2 : 1,
                }}
              >
                {array.length <= 30 && (
                  <span style={{ position: 'absolute', top: -18, fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>{bar.value}</span>
                )}
              </div>
            ))}
          </div>
        </section>
        {/* Legend */}
        <section style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px #e0e7ef33', marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#2563eb', marginBottom: 16 }}>Legend</h2>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', margin: '16px 0 32px 0', flexWrap: 'wrap' }}>
            {LEGEND[algorithm]?.map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 500, color: '#334155', background: '#f1f5f9', borderRadius: 6, padding: '4px 12px', border: `1.5px solid ${item.color}` }}>
                <span style={{ fontSize: 18 }}>{LEGEND_ICONS[item.label] || '⬜️'}</span>
                <span style={{ width: 18, height: 18, background: item.color, borderRadius: 4, display: 'inline-block', border: '1.5px solid #e5e7eb', marginRight: 4 }}></span>
                {item.label}
              </div>
            ))}
          </div>
        </section>
        {/* Progress */}
        <section style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px #e0e7ef33', marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#2563eb', marginBottom: 16 }}>Progress</h2>
          <div style={{ display: 'flex', gap: 32, fontSize: 18, color: '#334155', fontWeight: 600 }}>
            <div>Step: <span style={{ color: '#2563eb' }}>{currentStep + 1} / {steps.length}</span></div>
            <div>Status: <span style={{ color: (steps[steps.length - 1] && steps[steps.length - 1].sortedIndices && steps[steps.length - 1].sortedIndices.length === array.length) || (mode === 'search' && step && step.found !== null) ? '#22c55e' : '#f59e42' }}>{(steps[steps.length - 1] && steps[steps.length - 1].sortedIndices && steps[steps.length - 1].sortedIndices.length === array.length) || (mode === 'search' && step && step.found !== null) ? 'Done!' : (mode === 'search' ? 'Searching...' : 'Sorting...')}</span></div>
          </div>
        </section>
        {/* Collector Card Section */}
        <div
          style={{
            background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)',
            borderRadius: 18,
            boxShadow: '0 4px 24px #a5b4fc33',
            padding: 32,
            marginBottom: 32,
            maxWidth: 700,
            marginLeft: 'auto',
            marginRight: 'auto',
            border: '2px solid #6366f1',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 24, fontWeight: 700, color: '#3730a3', letterSpacing: '-0.01em' }}>{(mode === 'sort' ? sortingAlgorithms : searchingAlgorithms).find(a => a.value === algorithm)?.label}</h3>
              <span style={{ fontSize: 16, color: '#6366f1', fontWeight: 600 }}>{mode === 'sort' ? 'Sorting' : 'Searching'}</span>
            </div>
            <div style={{ fontSize: 16, color: '#334155', marginBottom: 8 }}>{info.desc}</div>
            <div style={{ display: 'flex', gap: 32, marginBottom: 8 }}>
              <div style={{ fontSize: 18, color: '#2563eb', fontWeight: 700 }}>Comparisons: <span style={{ color: '#0ea5e9' }}>{analytics.comparisons}</span></div>
              <div style={{ fontSize: 18, color: '#22c55e', fontWeight: 700 }}>Swaps: <span style={{ color: '#16a34a' }}>{analytics.swaps}</span></div>
              <div style={{ fontSize: 18, color: '#f59e42', fontWeight: 700 }}>Time: <span style={{ color: '#f59e42' }}>{analytics.time}s</span></div>
            </div>
            <div style={{ background: '#f1f5f9', borderRadius: 10, padding: 16, fontFamily: 'monospace', fontSize: 15, color: '#334155', whiteSpace: 'pre', border: '1px solid #c7d2fe' }}>
              {info.pseudo}
            </div>
          </div>
        </div>
        {/* Footer */}
        <footer style={{ textAlign: 'center', marginTop: 48, color: '#64748b', fontSize: 14 }}>
          <div>Made with <span style={{ color: '#2563eb', fontWeight: 700 }}>React</span> & <span style={{ color: '#2563eb', fontWeight: 700 }}>TypeScript</span> | Step-yielding algorithms in <span style={{ color: '#2563eb', fontWeight: 700 }}>visualAlgorithms.ts</span></div>
          <div style={{ marginTop: 4 }}>© {new Date().getFullYear()} Algorithm Visualizer. All rights reserved.</div>
        </footer>
      </main>
    </div>
  );
};

export default App;