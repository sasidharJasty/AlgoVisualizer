import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Shuffle, Settings, Search, BarChart3, Target, Zap, Activity, ArrowUp, ArrowDown } from 'lucide-react';

// Types
interface ArrayElement {
  id: number;
  value: number;
  originalIndex: number;
}

interface Statistics {
  comparisons: number;
  swaps: number;
  time: number;
  operations: number;
}

interface Algorithm {
  value: string;
  label: string;
  complexity: string;
  stable?: boolean;
  inPlace?: boolean;
  requirement?: string;
}

const AlgorithmVisualizer: React.FC = () => {
  const [array, setArray] = useState<ArrayElement[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [algorithm, setAlgorithm] = useState<string>('bubble');
  const [speed, setSpeed] = useState<number>(80);
  const [arraySize, setArraySize] = useState<number>(50);
  const [comparing, setComparing] = useState<number[]>([]);
  const [sorted, setSorted] = useState<number[]>([]);
  const [current, setCurrent] = useState<number>(-1);
  const [pivot, setPivot] = useState<number>(-1);
  const [mode, setMode] = useState<'sort' | 'search'>('sort');
  const [searchTarget, setSearchTarget] = useState<number>(50);
  const [searchResult, setSearchResult] = useState<number>(-1);
  const [searchPath, setSearchPath] = useState<number[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({ comparisons: 0, swaps: 0, time: 0, operations: 0 });
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [auxiliaryArray, setAuxiliaryArray] = useState<ArrayElement[]>([]);
  const [mergingRange, setMergingRange] = useState<number[]>([]);
  const [stepMode, setStepMode] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [steps, setSteps] = useState<any[]>([]); // Will hold the steps for the current algorithm
  const [isStepping, setIsStepping] = useState(false);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const isRunningRef = useRef<boolean>(false);

  const sleep = useCallback((ms: number): Promise<void> => {
    return new Promise(resolve => {
      timeoutRef.current = setTimeout(resolve, Math.max(5, Math.floor(ms / 2)));
    });
  }, []);

  const updateStats = useCallback((updates: Partial<Statistics>) => {
    setStatistics(prev => ({ ...prev, ...updates }));
  }, []);

  // Generate random array
  const generateArray = useCallback(() => {
    const newArray: ArrayElement[] = Array.from({ length: arraySize }, (_, i) => ({
      id: Date.now() + i,
      value: Math.floor(Math.random() * 490) + 10,
      originalIndex: i
    }));
    setArray(newArray);
    setComparing([]);
    setSorted([]);
    setCurrent(-1);
    setPivot(-1);
    setSearchResult(-1);
    setSearchPath([]);
    setAuxiliaryArray([]);
    setMergingRange([]);
    setStatistics({ comparisons: 0, swaps: 0, time: 0, operations: 0 });
    setIsCompleted(false);
    
    // Set search target to a value that exists in the array
    if (mode === 'search') {
      const randomIndex = Math.floor(Math.random() * arraySize);
      setSearchTarget(newArray[randomIndex].value);
    }
  }, [arraySize, mode]);

  useEffect(() => {
    generateArray();
  }, [generateArray]);

  // Update search target when array changes in search mode
  useEffect(() => {
    if (mode === 'search' && array.length > 0) {
      const randomIndex = Math.floor(Math.random() * array.length);
      setSearchTarget(array[randomIndex].value);
    }
  }, [array, mode]);

  // Utility function to swap elements
  const swap = async (arr: ArrayElement[], i: number, j: number): Promise<boolean> => {
    if (!isRunningRef.current) return false;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setArray([...arr]);
    updateStats({ swaps: statistics.swaps + 1 });
    await sleep(101 - speed);
    return true;
  };

  // SORTING ALGORITHMS

  // Bubble Sort
  const bubbleSort = async (): Promise<void> => {
    const arr = [...array];
    const n = arr.length;
    let comparisons = 0, swaps = 0;
    setSteps([]);
    for (let i = 0; i < n - 1 && isRunningRef.current; i++) {
      let swapped = false;
      for (let j = 0; j < n - i - 2 && isRunningRef.current; j++) {
        setComparing([j, j + 1]);
        comparisons++;
        updateStats({ comparisons });
        await sleep(51 - speed);
        if (arr[j].value > arr[j + 1].value) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          swaps++;
          swapped = true;
          setArray([...arr]);
          updateStats({ swaps });
        }
        if (stepMode) recordStep(arr, { comparing: [j, j + 1], sorted: [...sorted, n - 1 - i] });
      }
      setSorted(prev => [...prev, n - 1 - i]);
      if (!swapped) break;
    }
    if (isRunningRef.current) {
      setSorted(Array.from({ length: n }, (_, i) => i));
      setComparing([]);
      setIsCompleted(true);
    }
  };

  // Selection Sort
  const selectionSort = async (): Promise<void> => {
    const arr = [...array];
    const n = arr.length;
    let comparisons = 0, swaps = 0;
    
    for (let i = 0; i < n - 2 && isRunningRef.current; i++) {
      let minIdx = i;
      setCurrent(i);
      
      for (let j = i + 1; j < n && isRunningRef.current; j++) {
        setComparing([minIdx, j]);
        comparisons++;
        updateStats({ comparisons });
        
        await sleep(101 - speed);
        
        if (arr[j].value < arr[minIdx].value) {
          minIdx = j;
        }
      }
      
      if (minIdx !== i && isRunningRef.current) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        swaps++;
        setArray([...arr]);
        updateStats({ swaps });
        await sleep(101 - speed);
      }
      
      setSorted(prev => [...prev, i]);
    }
    
    if (isRunningRef.current) {
      setSorted(Array.from({ length: n }, (_, i) => i));
      setComparing([]);
      setCurrent(-1);
      setIsCompleted(true);
    }
  };

  // Quick Sort
  const quickSort = async (): Promise<void> => {
    const arr = [...array];
    let comparisons = 0, swaps = 0;
    
    const partition = async (low: number, high: number): Promise<number> => {
      const pivotValue = arr[high].value;
      setPivot(high);
      let i = low - 1;
      
      for (let j = low; j < high && isRunningRef.current; j++) {
        setComparing([j, high]);
        comparisons++;
        updateStats({ comparisons });
        
        await sleep(101 - speed);
        
        if (arr[j].value < pivotValue) {
          i++;
          if (i !== j) {
            [arr[i], arr[j]] = [arr[j], arr[i]];
            swaps++;
            setArray([...arr]);
            updateStats({ swaps });
            await sleep(101 - speed);
          }
        }
      }
      
      if (isRunningRef.current) {
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        swaps++;
        setArray([...arr]);
        updateStats({ swaps });
        setSorted(prev => [...prev, i + 1]);
      }
      
      return i + 1;
    };
    
    const quickSortHelper = async (low: number, high: number): Promise<void> => {
      if (low < high && isRunningRef.current) {
        const pi = await partition(low, high);
        await quickSortHelper(low, pi - 1);
        await quickSortHelper(pi + 1, high);
      }
    };
    
    await quickSortHelper(0, arr.length - 1);
    
    if (isRunningRef.current) {
      setSorted(Array.from({ length: arr.length }, (_, i) => i));
      setComparing([]);
      setPivot(-1);
      setIsCompleted(true);
    }
  };

  // Merge Sort
  const mergeSort = async (): Promise<void> => {
    const arr = [...array];
    let comparisons = 0, swaps = 0;
    
    const merge = async (left: number, mid: number, right: number): Promise<void> => {
      const leftArr = arr.slice(left, mid + 1).map(item => ({ ...item }));
      const rightArr = arr.slice(mid + 1, right + 1).map(item => ({ ...item }));
      
      setMergingRange([left, right]);
      setAuxiliaryArray([...leftArr, ...rightArr]);
      
      let i = 0, j = 0, k = left;
      
      while (i < leftArr.length && j < rightArr.length && isRunningRef.current) {
        setComparing([left + i, mid + 1 + j]);
        comparisons++;
        updateStats({ comparisons });
        
        await sleep(101 - speed);
        
        if (leftArr[i].value <= rightArr[j].value) {
          arr[k] = leftArr[i];
          i++;
        } else {
          arr[k] = rightArr[j];
          j++;
        }
        k++;
        swaps++;
        setArray([...arr]);
        updateStats({ swaps });
      }
      
      while (i < leftArr.length && isRunningRef.current) {
        arr[k] = leftArr[i];
        i++;
        k++;
        setArray([...arr]);
        await sleep(101 - speed);
      }
      
      while (j < rightArr.length && isRunningRef.current) {
        arr[k] = rightArr[j];
        j++;
        k++;
        setArray([...arr]);
        await sleep(101 - speed);
      }
      
      setAuxiliaryArray([]);
      setMergingRange([]);
    };
    
    const mergeSortHelper = async (left: number, right: number): Promise<void> => {
      if (left < right && isRunningRef.current) {
        const mid = Math.floor((left + right) / 2);
        await mergeSortHelper(left, mid);
        await mergeSortHelper(mid + 1, right);
        await merge(left, mid, right);
      }
    };
    
    await mergeSortHelper(0, arr.length - 1);
    
    if (isRunningRef.current) {
      setSorted(Array.from({ length: arr.length }, (_, i) => i));
      setComparing([]);
      setIsCompleted(true);
    }
  };

  // Insertion Sort
  const insertionSort = async (): Promise<void> => {
    const arr = [...array];
    const n = arr.length;
    let comparisons = 0, swaps = 0;
    setSteps([]);
    let sortedArr: number[] = [];
    for (let i = 1; i < n && isRunningRef.current; i++) {
      const key = arr[i];
      let j = i - 1;
      setCurrent(i);
      if (stepMode) recordStep(arr, { current: i, sorted: [...sortedArr] });
      while (j >= 0 && isRunningRef.current) {
        setComparing([j, j + 1]);
        comparisons++;
        updateStats({ comparisons });
        await sleep(51 - speed);
        if (arr[j].value > key.value) {
          arr[j + 1] = arr[j];
          swaps++;
          setArray([...arr]);
          updateStats({ swaps });
          j--;
        } else {
          break;
        }
        if (stepMode) recordStep(arr, { comparing: [j, j + 1], current: i, sorted: [...sortedArr] });
      }
      if (isRunningRef.current) {
        arr[j + 1] = key;
        setArray([...arr]);
        await sleep(51 - speed);
      }
      sortedArr = Array.from({ length: i + 1 }, (_, idx) => idx);
      if (stepMode) recordStep(arr, { current: i, sorted: [...sortedArr] });
    }
    if (isRunningRef.current) {
      setSorted(Array.from({ length: n }, (_, i) => i));
      setComparing([]);
      setCurrent(-1);
      setIsCompleted(true);
    }
  };

  // Shaker Sort (Bidirectional Bubble Sort)
  const shakerSort = async (): Promise<void> => {
    const arr = [...array];
    const n = arr.length;
    let comparisons = 0, swaps = 0;
    let left = 0, right = n - 1;
    let swapped = true;
    
    while (swapped && isRunningRef.current) {
      swapped = false;
      
      // Forward pass
      for (let i = left; i < right && isRunningRef.current; i++) {
        setComparing([i, i + 1]);
        comparisons++;
        updateStats({ comparisons });
        
        await sleep(101 - speed);
        
        if (arr[i].value > arr[i + 1].value) {
          [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
          swaps++;
          swapped = true;
          setArray([...arr]);
          updateStats({ swaps });
        }
      }
      right--;
      
      if (!swapped) break;
      
      swapped = false;
      
      // Backward pass
      for (let i = right; i > left && isRunningRef.current; i--) {
        setComparing([i - 1, i]);
        comparisons++;
        updateStats({ comparisons });
        
        await sleep(101 - speed);
        
        if (arr[i - 1].value > arr[i].value) {
          [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
          swaps++;
          swapped = true;
          setArray([...arr]);
          updateStats({ swaps });
        }
      }
      left++;
    }
    
    if (isRunningRef.current) {
      setSorted(Array.from({ length: n }, (_, i) => i));
      setComparing([]);
      setIsCompleted(true);
    }
  };

  // Comb Sort
  const combSort = async (): Promise<void> => {
    const arr = [...array];
    const n = arr.length;
    let comparisons = 0, swaps = 0;
    let gap = n;
    const shrink = 1.3;
    let sorted = false;
    
    while (!sorted && isRunningRef.current) {
      gap = Math.floor(gap / shrink);
      if (gap <= 1) {
        gap = 1;
        sorted = true;
      }
      
      for (let i = 0; i + gap < n && isRunningRef.current; i++) {
        setComparing([i, i + gap]);
        comparisons++;
        updateStats({ comparisons });
        
        await sleep(101 - speed);
        
        if (arr[i].value > arr[i + gap].value) {
          [arr[i], arr[i + gap]] = [arr[i + gap], arr[i]];
          swaps++;
          sorted = false;
          setArray([...arr]);
          updateStats({ swaps });
        }
      }
    }
    
    if (isRunningRef.current) {
      setSorted(Array.from({ length: n }, (_, i) => i));
      setComparing([]);
      setIsCompleted(true);
    }
  };

  // Odd-Even Sort
  const oddEvenSort = async (): Promise<void> => {
    const arr = [...array];
    const n = arr.length;
    let comparisons = 0, swaps = 0;
    let sorted = false;
    
    while (!sorted && isRunningRef.current) {
      sorted = true;
      
      // Odd phase
      for (let i = 1; i < n - 1; i += 2) {
        if (!isRunningRef.current) break;
        setComparing([i, i + 1]);
        comparisons++;
        updateStats({ comparisons });
        
        await sleep(101 - speed);
        
        if (arr[i].value > arr[i + 1].value) {
          [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
          swaps++;
          sorted = false;
          setArray([...arr]);
          updateStats({ swaps });
        }
      }
      
      // Even phase
      for (let i = 0; i < n - 1; i += 2) {
        if (!isRunningRef.current) break;
        setComparing([i, i + 1]);
        comparisons++;
        updateStats({ comparisons });
        
        await sleep(101 - speed);
        
        if (arr[i].value > arr[i + 1].value) {
          [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
          swaps++;
          sorted = false;
          setArray([...arr]);
          updateStats({ swaps });
        }
      }
    }
    
    if (isRunningRef.current) {
      setSorted(Array.from({ length: n }, (_, i) => i));
      setComparing([]);
      setIsCompleted(true);
    }
  };

  // Gnome Sort
  const gnomeSort = async (): Promise<void> => {
    const arr = [...array];
    const n = arr.length;
    let comparisons = 0, swaps = 0;
    let index = 0;
    
    while (index < n && isRunningRef.current) {
      setCurrent(index);
      
      if (index === 0) {
        index++;
        continue;
      }
      
      setComparing([index - 1, index]);
      comparisons++;
      updateStats({ comparisons });
      
      await sleep(101 - speed);
      
      if (arr[index].value >= arr[index - 1].value) {
        index++;
      } else {
        [arr[index], arr[index - 1]] = [arr[index - 1], arr[index]];
        swaps++;
        setArray([...arr]);
        updateStats({ swaps });
        index--;
      }
    }
    
    if (isRunningRef.current) {
      setSorted(Array.from({ length: n }, (_, i) => i));
      setComparing([]);
      setCurrent(-1);
      setIsCompleted(true);
    }
  };

  // Shell Sort
  const shellSort = async (): Promise<void> => {
    const arr = [...array];
    const n = arr.length;
    let comparisons = 0, swaps = 0;
    
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
      if (!isRunningRef.current) break;
      
      for (let i = gap; i < n && isRunningRef.current; i++) {
        const temp = arr[i];
        let j;
        setCurrent(i);
        
        for (j = i; j >= gap && isRunningRef.current; j -= gap) {
          setComparing([j - gap, j]);
          comparisons++;
          updateStats({ comparisons });
          
          await sleep(101 - speed);
          
          if (arr[j - gap].value > temp.value) {
            arr[j] = arr[j - gap];
            swaps++;
            setArray([...arr]);
            updateStats({ swaps });
          } else {
            break;
          }
        }
        
        if (isRunningRef.current) {
          arr[j] = temp;
          setArray([...arr]);
        }
      }
    }
    
    if (isRunningRef.current) {
      setSorted(Array.from({ length: n }, (_, i) => i));
      setComparing([]);
      setCurrent(-1);
      setIsCompleted(true);
    }
  };

  // Pancake Sort
  const pancakeSort = async (): Promise<void> => {
    const arr = [...array];
    const n = arr.length;
    let comparisons = 0, swaps = 0;
    
    const flip = async (end: number): Promise<void> => {
      let start = 0;
      while (start < end && isRunningRef.current) {
        [arr[start], arr[end]] = [arr[end], arr[start]];
        swaps++;
        setArray([...arr]);
        updateStats({ swaps });
        start++;
        end--;
        await sleep(101 - speed);
      }
    };
    
    const findMax = async (n: number): Promise<number> => {
      let mi = 0;
      for (let i = 0; i < n && isRunningRef.current; i++) {
        setComparing([mi, i]);
        comparisons++;
        updateStats({ comparisons });
        
        await sleep(101 - speed);
        
        if (arr[i].value > arr[mi].value) {
          mi = i;
        }
      }
      return mi;
    };
    
    for (let currSize = n; currSize > 1 && isRunningRef.current; currSize--) {
      const mi = await findMax(currSize);
      
      if (mi !== currSize - 1) {
        await flip(mi);
        await flip(currSize - 1);
      }
      
      setSorted(prev => [...prev, currSize - 1]);
    }
    
    if (isRunningRef.current) {
      setSorted(Array.from({ length: n }, (_, i) => i));
      setComparing([]);
      setIsCompleted(true);
    }
  };

  // Heap Sort
  const heapSort = async (): Promise<void> => {
    const arr = [...array];
    const n = arr.length;
    let comparisons = 0, swaps = 0;
    
    const heapify = async (n: number, i: number): Promise<void> => {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      
      if (left < n && isRunningRef.current) {
        setComparing([largest, left]);
        comparisons++;
        updateStats({ comparisons });
        
        await sleep(101 - speed);
        
        if (arr[left].value > arr[largest].value) {
          largest = left;
        }
      }
      
      if (right < n && isRunningRef.current) {
        setComparing([largest, right]);
        comparisons++;
        updateStats({ comparisons });
        
        await sleep(101 - speed);
        
        if (arr[right].value > arr[largest].value) {
          largest = right;
        }
      }
      
      if (largest !== i && isRunningRef.current) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        swaps++;
        setArray([...arr]);
        updateStats({ swaps });
        await heapify(n, largest);
      }
    };
    
    // Build heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      if (!isRunningRef.current) break;
      await heapify(n, i);
    }
    
    // Extract elements from heap
    for (let i = n - 1; i > 0 && isRunningRef.current; i--) {
      [arr[0], arr[i]] = [arr[i], arr[0]];
      swaps++;
      setArray([...arr]);
      updateStats({ swaps });
      setSorted(prev => [...prev, i]);
      await sleep(101 - speed);
      await heapify(i, 0);
    }
    
    if (isRunningRef.current) {
      setSorted(Array.from({ length: n }, (_, i) => i));
      setComparing([]);
      setIsCompleted(true);
    }
  };

  // Radix Sort
  const radixSort = async (): Promise<void> => {
    const arr = [...array];
    const n = arr.length;
    let comparisons = 0, swaps = 0;
    
    const getMax = (): number => {
      let max = arr[0].value;
      for (let i = 1; i < n; i++) {
        if (arr[i].value > max) max = arr[i].value;
      }
      return max;
    };
    
    const countSort = async (exp: number): Promise<void> => {
      const output = new Array(n);
      const count = new Array(10).fill(0);
      
      for (let i = 0; i < n && isRunningRef.current; i++) {
        count[Math.floor(arr[i].value / exp) % 10]++;
        setCurrent(i);
        await sleep(101 - speed);
      }
      
      for (let i = 1; i < 10 && isRunningRef.current; i++) {
        count[i] += count[i - 1];
      }
      
      for (let i = n - 1; i >= 0 && isRunningRef.current; i--) {
        const digit = Math.floor(arr[i].value / exp) % 10;
        output[count[digit] - 1] = arr[i];
        count[digit]--;
        setCurrent(i);
        await sleep(101 - speed);
      }
      
      for (let i = 0; i < n && isRunningRef.current; i++) {
        arr[i] = output[i];
        setArray([...arr]);
        await sleep(101 - speed);
      }
    };
    
    const max = getMax();
    
    for (let exp = 1; Math.floor(max / exp) > 0 && isRunningRef.current; exp *= 10) {
      await countSort(exp);
    }
    
    if (isRunningRef.current) {
      setSorted(Array.from({ length: n }, (_, i) => i));
      setComparing([]);
      setCurrent(-1);
      setIsCompleted(true);
    }
  };

  // Bitonic Sort
  const bitonicSort = async (): Promise<void> => {
    const arr = [...array];
    const n = arr.length;
    let comparisons = 0, swaps = 0;
    
    const bitonicMerge = async (low: number, cnt: number, dir: boolean): Promise<void> => {
      if (cnt > 1 && isRunningRef.current) {
        const k = Math.floor(cnt / 2);
        for (let i = low; i < low + k && isRunningRef.current; i++) {
          setComparing([i, i + k]);
          comparisons++;
          updateStats({ comparisons });
          
          await sleep(101 - speed);
          
          if (dir === (arr[i].value > arr[i + k].value)) {
            [arr[i], arr[i + k]] = [arr[i + k], arr[i]];
            swaps++;
            setArray([...arr]);
            updateStats({ swaps });
          }
        }
        await bitonicMerge(low, k, dir);
        await bitonicMerge(low + k, k, dir);
      }
    };
    
    const bitonicSortHelper = async (low: number, cnt: number, dir: boolean): Promise<void> => {
      if (cnt > 1 && isRunningRef.current) {
        const k = Math.floor(cnt / 2);
        await bitonicSortHelper(low, k, true);
        await bitonicSortHelper(low + k, k, false);
        await bitonicMerge(low, cnt, dir);
      }
    };
    
    await bitonicSortHelper(0, n, true);
    
    if (isRunningRef.current) {
      setSorted(Array.from({ length: n }, (_, i) => i));
      setComparing([]);
      setIsCompleted(true);
    }
  };

  // Bogo Sort
  const bogoSort = async (): Promise<void> => {
    const arr = [...array];
    const n = arr.length;
    let comparisons = 0, swaps = 0;
    
    const isSorted = (): boolean => {
      for (let i = 1; i < n; i++) {
        if (arr[i - 1].value > arr[i].value) return false;
      }
      return true;
    };
    
    const shuffle = async (): Promise<void> => {
      for (let i = n - 1; i > 0 && isRunningRef.current; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
        swaps++;
        setArray([...arr]);
        updateStats({ swaps });
        await sleep(101 - speed);
      }
    };
    
    while (!isSorted() && isRunningRef.current) {
      await shuffle();
      comparisons++;
      updateStats({ comparisons });
    }
    
    if (isRunningRef.current) {
      setSorted(Array.from({ length: n }, (_, i) => i));
      setComparing([]);
      setIsCompleted(true);
    }
  };

  // Miracle Sort
  const miracleSort = async (): Promise<void> => {
    const arr = [...array];
    const n = arr.length;
    let comparisons = 0;
    
    const isSorted = (): boolean => {
      for (let i = 1; i < n; i++) {
        if (arr[i - 1].value > arr[i].value) return false;
      }
      return true;
    };
    
    while (!isSorted() && isRunningRef.current) {
      comparisons++;
      updateStats({ comparisons });
      await sleep(101 - speed);
    }
    
    if (isRunningRef.current) {
      setSorted(Array.from({ length: n }, (_, i) => i));
      setComparing([]);
      setIsCompleted(true);
    }
  };

  // Decide Sort (Randomized Quick Sort)
  const decideSort = async (): Promise<void> => {
    const arr = [...array];
    let comparisons = 0, swaps = 0;
    
    const partition = async (low: number, high: number): Promise<number> => {
      const randomIndex = Math.floor(Math.random() * (high - low + 1)) + low;
      [arr[randomIndex], arr[high]] = [arr[high], arr[randomIndex]];
      
      const pivotValue = arr[high].value;
      setPivot(high);
      let i = low - 1;
      
      for (let j = low; j < high && isRunningRef.current; j++) {
        setComparing([j, high]);
        comparisons++;
        updateStats({ comparisons });
        
        await sleep(101 - speed);
        
        if (arr[j].value < pivotValue) {
          i++;
          if (i !== j) {
            [arr[i], arr[j]] = [arr[j], arr[i]];
            swaps++;
            setArray([...arr]);
            updateStats({ swaps });
            await sleep(101 - speed);
          }
        }
      }
      
      if (isRunningRef.current) {
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        swaps++;
        setArray([...arr]);
        updateStats({ swaps });
        setSorted(prev => [...prev, i + 1]);
      }
      
      return i + 1;
    };
    
    const decideSortHelper = async (low: number, high: number): Promise<void> => {
      if (low < high && isRunningRef.current) {
        const pi = await partition(low, high);
        await decideSortHelper(low, pi - 1);
        await decideSortHelper(pi + 1, high);
      }
    };
    
    await decideSortHelper(0, arr.length - 1);
    
    if (isRunningRef.current) {
      setSorted(Array.from({ length: arr.length }, (_, i) => i));
      setComparing([]);
      setPivot(-1);
      setIsCompleted(true);
    }
  };

  // SEARCH ALGORITHMS

  // Linear Search
  const linearSearch = async (): Promise<void> => {
    const target = searchTarget;
    let comparisons = 0;
    const path: number[] = [];
    
    for (let i = 0; i < array.length && isRunningRef.current; i++) {
      setCurrent(i);
      path.push(i);
      setSearchPath([...path]);
      comparisons++;
      updateStats({ comparisons });
      
      await sleep(101 - speed);
      
      if (array[i].value === target) {
        setSearchResult(i);
        setIsCompleted(true);
        return;
      }
    }
    
    if (isRunningRef.current) {
      setSearchResult(-1);
      setCurrent(-1);
      setIsCompleted(true);
    }
  };

  // Binary Search
  const binarySearch = async (): Promise<void> => {
    // Sort array first
    const sortedArray = [...array].sort((a, b) => a.value - b.value);
    setArray(sortedArray);
    await sleep(500);
    
    const target = searchTarget;
    let left = 0;
    let right = sortedArray.length - 1;
    let comparisons = 0;
    const path: number[] = [];
    
    while (left <= right && isRunningRef.current) {
      const mid = Math.floor((left + right) / 2);
      setCurrent(mid);
      setComparing([left, right]);
      path.push(mid);
      setSearchPath([...path]);
      comparisons++;
      updateStats({ comparisons });
      
      await sleep(101 - speed);
      
      if (sortedArray[mid].value === target) {
        setSearchResult(mid);
        setIsCompleted(true);
        return;
      }
      
      if (sortedArray[mid].value < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    
    if (isRunningRef.current) {
      setSearchResult(-1);
      setCurrent(-1);
      setComparing([]);
      setIsCompleted(true);
    }
  };

  // Jump Search
  const jumpSearch = async (): Promise<void> => {
    // Sort array first
    const sortedArray = [...array].sort((a, b) => a.value - b.value);
    setArray(sortedArray);
    await sleep(500);
    
    const target = searchTarget;
    const n = sortedArray.length;
    let step = Math.floor(Math.sqrt(n));
    let comparisons = 0;
    const path: number[] = [];
    
    let prev = 0;
    while (prev < n && sortedArray[Math.min(step, n) - 1].value < target && isRunningRef.current) {
      prev = step;
      step += Math.floor(Math.sqrt(n));
      if (prev >= n) {
        setSearchResult(-1);
        setIsCompleted(true);
        return;
      }
    }
    
    while (prev < Math.min(step, n) && isRunningRef.current) {
      setCurrent(prev);
      path.push(prev);
      setSearchPath([...path]);
      comparisons++;
      updateStats({ comparisons });
      
      await sleep(101 - speed);
      
      if (sortedArray[prev].value === target) {
        setSearchResult(prev);
        setIsCompleted(true);
        return;
      }
      prev++;
    }
    
    if (isRunningRef.current) {
      setSearchResult(-1);
      setCurrent(-1);
      setIsCompleted(true);
    }
  };

  // Interpolation Search
  const interpolationSearch = async (): Promise<void> => {
    // Sort array first
    const sortedArray = [...array].sort((a, b) => a.value - b.value);
    setArray(sortedArray);
    await sleep(500);
    
    const target = searchTarget;
    let low = 0;
    let high = sortedArray.length - 1;
    let comparisons = 0;
    const path: number[] = [];
    
    while (low <= high && target >= sortedArray[low].value && target <= sortedArray[high].value && isRunningRef.current) {
      if (low === high) {
        if (sortedArray[low].value === target) {
          setSearchResult(low);
          setIsCompleted(true);
          return;
        }
        setSearchResult(-1);
        setIsCompleted(true);
        return;
      }
      
      const pos = low + Math.floor(((high - low) / (sortedArray[high].value - sortedArray[low].value)) * (target - sortedArray[low].value));
      setCurrent(pos);
      setComparing([low, high]);
      path.push(pos);
      setSearchPath([...path]);
      comparisons++;
      updateStats({ comparisons });
      
      await sleep(101 - speed);
      
      if (sortedArray[pos].value === target) {
        setSearchResult(pos);
        setIsCompleted(true);
        return;
      }
      
      if (sortedArray[pos].value < target) {
        low = pos + 1;
      } else {
        high = pos - 1;
      }
    }
    
    if (isRunningRef.current) {
      setSearchResult(-1);
      setCurrent(-1);
      setComparing([]);
      setIsCompleted(true);
    }
  };

  // Exponential Search
  const exponentialSearch = async (): Promise<void> => {
    // Sort array first
    const sortedArray = [...array].sort((a, b) => a.value - b.value);
    setArray(sortedArray);
    await sleep(500);
    
    const target = searchTarget;
    const n = sortedArray.length;
    let comparisons = 0;
    const path: number[] = [];
    
    if (sortedArray[0].value === target) {
      setSearchResult(0);
      setIsCompleted(true);
      return;
    }
    
    let i = 1;
    while (i < n && sortedArray[i].value <= target && isRunningRef.current) {
      setCurrent(i);
      path.push(i);
      setSearchPath([...path]);
      comparisons++;
      updateStats({ comparisons });
      
      await sleep(101 - speed);
      i = i * 2;
    }
    
    // Binary search in the found range
    let left = Math.floor(i / 2);
    let right = Math.min(i, n - 1);
    
    while (left <= right && isRunningRef.current) {
      const mid = Math.floor((left + right) / 2);
      setCurrent(mid);
      setComparing([left, right]);
      path.push(mid);
      setSearchPath([...path]);
      comparisons++;
      updateStats({ comparisons });
      
      await sleep(101 - speed);
      
      if (sortedArray[mid].value === target) {
        setSearchResult(mid);
        setIsCompleted(true);
        return;
      }
      
      if (sortedArray[mid].value < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    
    if (isRunningRef.current) {
      setSearchResult(-1);
      setCurrent(-1);
      setComparing([]);
      setIsCompleted(true);
    }
  };

  // Fibonacci Search
  const fibonacciSearch = async (): Promise<void> => {
    // Sort array first
    const sortedArray = [...array].sort((a, b) => a.value - b.value);
    setArray(sortedArray);
    await sleep(500);
    
    const target = searchTarget;
    const n = sortedArray.length;
    let comparisons = 0;
    const path: number[] = [];
    
    // Initialize Fibonacci numbers
    let fibMMm2 = 0;
    let fibMMm1 = 1;
    let fibM = fibMMm2 + fibMMm1;
    
    while (fibM < n) {
      fibMMm2 = fibMMm1;
      fibMMm1 = fibM;
      fibM = fibMMm2 + fibMMm1;
    }
    
    let offset = -1;
    
    while (fibM > 1 && isRunningRef.current) {
      const i = Math.min(offset + fibMMm2, n - 1);
      setCurrent(i);
      path.push(i);
      setSearchPath([...path]);
      comparisons++;
      updateStats({ comparisons });
      
      await sleep(101 - speed);
      
      if (sortedArray[i].value < target) {
        fibM = fibMMm1;
        fibMMm1 = fibMMm2;
        fibMMm2 = fibM - fibMMm1;
        offset = i;
      } else if (sortedArray[i].value > target) {
        fibM = fibMMm2;
        fibMMm1 = fibMMm1 - fibMMm2;
        fibMMm2 = fibM - fibMMm1;
      } else {
        setSearchResult(i);
        setIsCompleted(true);
        return;
      }
    }
    
    if (fibMMm1 && offset + 1 < n && sortedArray[offset + 1].value === target && isRunningRef.current) {
      setSearchResult(offset + 1);
      setIsCompleted(true);
      return;
    }
    
    if (isRunningRef.current) {
      setSearchResult(-1);
      setCurrent(-1);
      setComparing([]);
      setIsCompleted(true);
    }
  };

  const startVisualization = async (): Promise<void> => {
    if (isPlaying) {
      setIsPlaying(false);
      isRunningRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }
    
    setIsPlaying(true);
    isRunningRef.current = true;
    setIsCompleted(false);
    startTimeRef.current = Date.now();
    
    const timer = setInterval(() => {
      if (startTimeRef.current && isRunningRef.current) {
        setStatistics(prev => ({
          ...prev,
          time: Math.floor((Date.now() - startTimeRef.current!) / 1000)
        }));
      }
    }, 100);
    
    try {
      if (mode === 'sort') {
        switch (algorithm) {
          case 'bubble': await bubbleSort(); break;
          case 'insertion': await insertionSort(); break;
          case 'selection': await selectionSort(); break;
          case 'shaker': await shakerSort(); break;
          case 'comb': await combSort(); break;
          case 'oddEven': await oddEvenSort(); break;
          case 'gnome': await gnomeSort(); break;
          case 'shell': await shellSort(); break;
          case 'pancake': await pancakeSort(); break;
          case 'merge': await mergeSort(); break;
          case 'quick': await quickSort(); break;
          case 'heap': await heapSort(); break;
          case 'radix': await radixSort(); break;
          case 'bitonic': await bitonicSort(); break;
          case 'bogo': await bogoSort(); break;
          case 'miracle': await miracleSort(); break;
          case 'decide': await decideSort(); break;
        }
      } else {
        switch (algorithm) {
          case 'linear': await linearSearch(); break;
          case 'binary': await binarySearch(); break;
          case 'jump': await jumpSearch(); break;
          case 'interpolation': await interpolationSearch(); break;
          case 'exponential': await exponentialSearch(); break;
          case 'fibonacci': await fibonacciSearch(); break;
        }
      }
    } catch (error) {
      console.log('Visualization stopped');
    }
    
    clearInterval(timer);
    setIsPlaying(false);
    isRunningRef.current = false;
  };

  const reset = (): void => {
    setIsPlaying(false);
    isRunningRef.current = false;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    generateArray();
  };

  const getBarColor = (index: number): string => {
    if (searchResult === index) return '#00ff88'; 
    if (current === index) return '#ff0066'; 
    if (pivot === index) return '#ffaa00'; 
    if (comparing.includes(index)) return '#00ddff'; 
    if (sorted.includes(index)) return '#4466ff'; 
    if (searchPath.includes(index)) return '#ff6600'; 
    if (mergingRange.length && index >= mergingRange[0] && index <= mergingRange[1]) return '#aa44ff'; 
    return '#667eea'; 
  };

  const sortingAlgorithms: Algorithm[] = [
    { value: 'bubble', label: 'Bubble Sort', complexity: 'O(n²)', stable: true, inPlace: true },
    { value: 'insertion', label: 'Insertion Sort', complexity: 'O(n²)', stable: true, inPlace: true },
    { value: 'selection', label: 'Selection Sort', complexity: 'O(n²)', stable: false, inPlace: true },
    { value: 'shaker', label: 'Shaker Sort', complexity: 'O(n²)', stable: true, inPlace: true },
    { value: 'comb', label: 'Comb Sort', complexity: 'O(n²)', stable: false, inPlace: true },
    { value: 'oddEven', label: 'Odd-Even Sort', complexity: 'O(n²)', stable: true, inPlace: true },
    { value: 'gnome', label: 'Gnome Sort', complexity: 'O(n²)', stable: true, inPlace: true },
    { value: 'shell', label: 'Shell Sort', complexity: 'O(n log n)', stable: false, inPlace: true },
    { value: 'pancake', label: 'Pancake Sort', complexity: 'O(n²)', stable: false, inPlace: true },
    { value: 'merge', label: 'Merge Sort', complexity: 'O(n log n)', stable: true, inPlace: false },
    { value: 'quick', label: 'Quick Sort', complexity: 'O(n log n)', stable: false, inPlace: true },
    { value: 'heap', label: 'Heap Sort', complexity: 'O(n log n)', stable: false, inPlace: true },
    { value: 'radix', label: 'Radix Sort', complexity: 'O(nk)', stable: true, inPlace: false },
    { value: 'bitonic', label: 'Bitonic Sort', complexity: 'O(n log²n)', stable: false, inPlace: true },
    { value: 'bogo', label: 'Bogo Sort', complexity: 'O((n+1)!)', stable: false, inPlace: true },
    { value: 'miracle', label: 'Miracle Sort', complexity: 'O(∞)', stable: true, inPlace: true },
    { value: 'decide', label: 'Decide Sort', complexity: 'O(n log n)', stable: false, inPlace: true }
  ];

  const searchAlgorithms: Algorithm[] = [
    { value: 'linear', label: 'Linear Search', complexity: 'O(n)', requirement: 'Unsorted' },
    { value: 'binary', label: 'Binary Search', complexity: 'O(log n)', requirement: 'Sorted' },
    { value: 'jump', label: 'Jump Search', complexity: 'O(√n)', requirement: 'Sorted' },
    { value: 'interpolation', label: 'Interpolation Search', complexity: 'O(log log n)', requirement: 'Sorted' },
    { value: 'exponential', label: 'Exponential Search', complexity: 'O(log n)', requirement: 'Sorted' },
    { value: 'fibonacci', label: 'Fibonacci Search', complexity: 'O(log n)', requirement: 'Sorted' }
  ];

  const algorithms = mode === 'sort' ? sortingAlgorithms : searchAlgorithms;
  const currentAlgo = algorithms.find(a => a.value === algorithm);

  // Helper to record steps for step-through mode
  const recordStep = (arr: ArrayElement[], extra: any = {}) => {
    setSteps((prev) => [...prev, { array: [...arr], ...extra }]);
  };

  // Step-through logic
  const handleStep = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
      const step = steps[stepIndex + 1];
      setArray(step.array);
      setComparing(step.comparing || []);
      setSorted(step.sorted || []);
      setCurrent(step.current || -1);
      setPivot(step.pivot || -1);
    }
  };

  const handleAutoPlay = async () => {
    setIsStepping(true);
    for (let i = stepIndex + 1; i < steps.length; i++) {
      await new Promise((res) => setTimeout(res, 1000 / (speed / 10 + 1)));
      setStepIndex(i);
      const step = steps[i];
      setArray(step.array);
      setComparing(step.comparing || []);
      setSorted(step.sorted || []);
      setCurrent(step.current || -1);
      setPivot(step.pivot || -1);
      if (!isStepping) break;
    }
    setIsStepping(false);
  };

  const handleStepModeToggle = () => {
    setStepMode((prev) => !prev);
    setStepIndex(0);
    setSteps([]);
    setIsStepping(false);
    reset();
  };

  // Pseudocode map for algorithms
  const pseudocodeMap: Record<string, string> = {
    bubble: `for i from 0 to n-1
  for j from 0 to n-i-2
    if arr[j] > arr[j+1]
      swap arr[j] and arr[j+1]`,
    insertion: `for i from 1 to n-1
  key = arr[i]
  j = i-1
  while j >= 0 and arr[j] > key
    arr[j+1] = arr[j]
    j = j-1
  arr[j+1] = key`,
    selection: `for i from 0 to n-2
  minIdx = i
  for j from i+1 to n-1
    if arr[j] < arr[minIdx]
      minIdx = j
  swap arr[i] and arr[minIdx]`,
    shaker: `left = 0, right = n-1, swapped = true
while swapped
  swapped = false
  for i from left to right-1
    if arr[i] > arr[i+1]
      swap arr[i], arr[i+1]
      swapped = true
  right--
  for i from right to left+1 step -1
    if arr[i] < arr[i-1]
      swap arr[i], arr[i-1]
      swapped = true
  left++`,
    comb: `gap = n, shrink = 1.3, sorted = false
while not sorted
  gap = floor(gap / shrink)
  if gap <= 1
    gap = 1
    sorted = true
  for i from 0 to n-gap-1
    if arr[i] > arr[i+gap]
      swap arr[i], arr[i+gap]
      sorted = false`,
    oddEven: `sorted = false
while not sorted
  sorted = true
  for i from 1 to n-2 step 2
    if arr[i] > arr[i+1]
      swap arr[i], arr[i+1]
      sorted = false
  for i from 0 to n-2 step 2
    if arr[i] > arr[i+1]
      swap arr[i], arr[i+1]
      sorted = false`,
    gnome: `i = 0
while i < n
  if i == 0 or arr[i] >= arr[i-1]
    i++
  else
    swap arr[i], arr[i-1]
    i--`,
    shell: `for gap = n/2 down to 1 by gap // 2
  for i from gap to n-1
    temp = arr[i]
    j = i
    while j >= gap and arr[j-gap] > temp
      arr[j] = arr[j-gap]
      j -= gap
    arr[j] = temp`,
    pancake: `for currSize from n down to 2
  mi = index of max in arr[0..currSize-1]
  if mi != currSize-1
    flip arr[0..mi]
    flip arr[0..currSize-1]`,
    merge: `mergeSort(arr, l, r):
  if l < r
    m = (l+r)//2
    mergeSort(arr, l, m)
    mergeSort(arr, m+1, r)
    merge(arr, l, m, r)
merge(arr, l, m, r):
  create left[] and right[]
  while left and right not empty
    if left[0] <= right[0]
      arr[k++] = left.pop(0)
    else
      arr[k++] = right.pop(0)
  copy remaining left and right`,
    quick: `quickSort(arr, low, high):
  if low < high
    pi = partition(arr, low, high)
    quickSort(arr, low, pi-1)
    quickSort(arr, pi+1, high)
partition(arr, low, high):
  pivot = arr[high]
  i = low-1
  for j = low to high-1
    if arr[j] < pivot
      i++
      swap arr[i], arr[j]
  swap arr[i+1], arr[high]
  return i+1`,
    heap: `heapSort(arr):
  build max heap
  for i from n-1 down to 1
    swap arr[0], arr[i]
    heapify(arr, 0, i)
heapify(arr, i, n):
  largest = i
  l = 2*i+1, r = 2*i+2
  if l < n and arr[l] > arr[largest]
    largest = l
  if r < n and arr[r] > arr[largest]
    largest = r
  if largest != i
    swap arr[i], arr[largest]
    heapify(arr, largest, n)`,
    radix: `getMax(arr):
  max = arr[0]
  for i from 1 to n-1
    if arr[i] > max
      max = arr[i]
  return max
for exp = 1; max/exp > 0; exp *= 10
  countSort(arr, exp)
countSort(arr, exp):
  output[] = 0, count[10] = 0
  for i in arr
    count[(arr[i]/exp)%10]++
  for i = 1 to 9
    count[i] += count[i-1]
  for i = n-1 downto 0
    output[count[digit]-1] = arr[i]
    count[digit]--
  copy output to arr`,
    bitonic: `bitonicSort(arr, low, cnt, dir):
  if cnt > 1
    k = cnt/2
    bitonicSort(arr, low, k, 1)
    bitonicSort(arr, low+k, k, 0)
    bitonicMerge(arr, low, cnt, dir)
bitonicMerge(arr, low, cnt, dir):
  if cnt > 1
    k = cnt/2
    for i = low to low+k-1
      if (dir==1 and arr[i]>arr[i+k]) or (dir==0 and arr[i]<arr[i+k])
        swap arr[i], arr[i+k]
    bitonicMerge(arr, low, k, dir)
    bitonicMerge(arr, low+k, k, dir)`,
    bogo: `while not isSorted(arr)
  shuffle(arr)
isSorted(arr):
  for i from 1 to n-1
    if arr[i-1] > arr[i]
      return false
  return true`,
    miracle: `while not isSorted(arr)
  // do nothing (miracle happens)
isSorted(arr):
  for i from 1 to n-1
    if arr[i-1] > arr[i]
      return false
  return true`,
    decide: `decideSort(arr, low, high):
  if low < high
    pi = randomPartition(arr, low, high)
    decideSort(arr, low, pi-1)
    decideSort(arr, pi+1, high)
randomPartition(arr, low, high):
  r = random(low, high)
  swap arr[r], arr[high]
  return partition(arr, low, high)`,
    linear: `for i from 0 to n-1
  if arr[i] == target
    return i
return -1`,
    binary: `left = 0, right = n-1
while left <= right
  mid = (left+right)//2
  if arr[mid] == target
    return mid
  else if arr[mid] < target
    left = mid+1
  else
    right = mid-1
return -1`,
    jump: `step = sqrt(n), prev = 0
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
return -1`,
    interpolation: `low = 0, high = n-1
while low <= high and target >= arr[low] and target <= arr[high]
  pos = low + ((high-low) // (arr[high]-arr[low])) * (target-arr[low])
  if arr[pos] == target
    return pos
  if arr[pos] < target
    low = pos+1
  else
    high = pos-1
return -1`,
    exponential: `if arr[0] == target
  return 0
i = 1
while i < n and arr[i] <= target
  i *= 2
return binarySearch(arr, i//2, min(i, n-1), target)`,
    fibonacci: `fibMMm2 = 0, fibMMm1 = 1, fibM = fibMMm2 + fibMMm1
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
return -1`,
  };

  return (
    <div className="min-h-screen w-screen bg-gray-50 text-gray-800 flex overflow-x-hidden">
      {/* Main visualization area (80vw) */}
      <div className="flex flex-col w-[80vw] min-w-0 bg-white border-r border-gray-200">
        {/* Header */}
        <header className="w-full border-b border-gray-200 bg-white py-6 mb-6">
          <div className="px-4 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-1">Algo Nexus</h1>
            <p className="text-gray-500 text-base font-normal">Algorithm Visualization Platform</p>
          </div>
        </header>
        <main className="flex-1 w-full px-4">
          {/* Mode Switcher */}
          <div className="flex justify-center mb-6 gap-3">
            {(['sort', 'search'] as const).map((modeOption) => (
              <button
                key={modeOption}
                onClick={() => {
                  setMode(modeOption);
                  setAlgorithm(modeOption === 'sort' ? 'bubble' : 'linear');
                  if (modeOption === 'search') {
                    const randomIndex = Math.floor(Math.random() * array.length);
                    setSearchTarget(array[randomIndex].value);
                  }
                  reset();
                }}
                className={`px-4 py-2 rounded font-medium text-base border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  mode === modeOption
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
                }`}
              >
                {modeOption === 'sort' ? 'Sorting' : 'Searching'}
              </button>
            ))}
            <button
              onClick={handleStepModeToggle}
              className={`px-4 py-2 rounded font-medium text-base border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-green-400 ${
                stepMode ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50'
              }`}
            >
              {stepMode ? 'Step Mode: On' : 'Step Mode: Off'}
            </button>
          </div>
          {/* Visualization Area - full width */}
          <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-none mb-6 w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Array Visualization</h3>
              <div className="text-xs text-gray-500">
                {array.length} elements • {currentAlgo?.complexity}
              </div>
            </div>
            {/* Array Bars - full width, very tall */}
            <div className="flex items-end justify-center gap-1 h-[50vh] w-full overflow-x-auto mb-6">
              <AnimatePresence>
                {array.map((element, index) => (
                  <motion.div
                    key={element.id}
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    exit={{ opacity: 0, scaleY: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative"
                    style={{
                      width: `${Math.max(10, (window.innerWidth * 0.8) / arraySize)}px`,
                      height: `${(element.value / 500) * 400}px`,
                      backgroundColor: getBarColor(index),
                      borderRadius: '4px 4px 0 0',
                      border: '1px solid #e5e7eb',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {arraySize <= 30 && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono text-gray-700">
                        {element.value}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {/* Status Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded border border-gray-400"></div>
                <span className="text-gray-500">Normal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded border border-blue-500"></div>
                <span className="text-gray-500">Comparing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded border border-green-500"></div>
                <span className="text-gray-500">Sorted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded border border-red-500"></div>
                <span className="text-gray-500">Current</span>
              </div>
              {mode === 'search' && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded border border-yellow-500"></div>
                    <span className="text-gray-500">Search Path</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded border border-blue-700"></div>
                    <span className="text-gray-500">Found</span>
                  </div>
                </>
              )}
              {algorithm === 'quick' && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-400 rounded border border-purple-500"></div>
                  <span className="text-gray-500">Pivot</span>
                </div>
              )}
              {algorithm === 'merge' && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-indigo-400 rounded border border-indigo-500"></div>
                  <span className="text-gray-500">Merging</span>
                </div>
              )}
            </div>
          </section>
          {/* Controls (Start, Step, Auto, Reset, Shuffle) */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
              onClick={startVisualization}
              disabled={!array.length || stepMode}
              className={`px-6 py-2 rounded font-semibold text-base border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center gap-2 ${
                isPlaying ? 'bg-red-600 text-white border-red-600' : 'bg-blue-600 text-white border-blue-600'
              }`}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              {isPlaying ? 'Pause' : 'Start'}
            </button>
            {stepMode && (
              <>
                <button
                  onClick={handleStep}
                  disabled={stepIndex >= steps.length - 1}
                  className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded font-semibold text-base border border-yellow-600 transition-colors duration-150"
                >
                  Step
                </button>
                <button
                  onClick={handleAutoPlay}
                  disabled={isStepping || stepIndex >= steps.length - 1}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded font-semibold text-base border border-gray-700 transition-colors duration-150"
                >
                  Auto
                </button>
              </>
            )}
            <button
              onClick={reset}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded font-semibold text-base border border-gray-300 transition-colors duration-150 flex items-center gap-2"
            >
              <RotateCcw size={18} />
              Reset
            </button>
            <button
              onClick={generateArray}
              className="px-6 py-2 bg-gray-100 hover:bg-blue-100 text-blue-700 rounded font-semibold text-base border border-blue-200 transition-colors duration-150 flex items-center gap-2"
            >
              <Shuffle size={18} />
              Shuffle
            </button>
          </div>
          {/* Parameters Panel - below controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Algorithm Selection */}
            <div className="bg-white border border-gray-200 rounded p-4">
              <h3 className="text-base font-semibold mb-2 text-blue-700">Algorithm</h3>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {algorithms.map((algo) => (
                  <option key={algo.value} value={algo.value} className="bg-white text-gray-900">
                    {algo.label} - {algo.complexity}
                  </option>
                ))}
              </select>
              {currentAlgo && (
                <div className="mt-2 text-xs text-gray-500 space-y-1">
                  <div>Complexity: <span className="text-blue-600 font-mono">{currentAlgo.complexity}</span></div>
                  {currentAlgo.stable !== undefined && (
                    <div>Stable: <span className={currentAlgo.stable ? "text-green-600" : "text-red-600"}>{currentAlgo.stable ? 'Yes' : 'No'}</span></div>
                  )}
                  {currentAlgo.requirement && (
                    <div>Requires: <span className="text-yellow-600">{currentAlgo.requirement}</span></div>
                  )}
                </div>
              )}
            </div>
            {/* Speed & Size Controls */}
            <div className="bg-white border border-gray-200 rounded p-4">
              <h3 className="text-base font-semibold mb-2 text-blue-700">Parameters</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Speed: {speed}%
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Array Size: {arraySize}
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={arraySize}
                    onChange={(e) => setArraySize(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded appearance-none cursor-pointer"
                  />
                </div>
                {mode === 'search' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Search Target: {searchTarget} <span className="text-green-600 text-xs">(Guaranteed in array)</span>
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="500"
                      value={searchTarget}
                      onChange={(e) => setSearchTarget(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <p className="text-xs text-gray-400 mt-1">Target is automatically set to a value in the array</p>
                    <button
                      onClick={() => {
                        const randomIndex = Math.floor(Math.random() * array.length);
                        setSearchTarget(array[randomIndex].value);
                      }}
                      className="mt-2 px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs rounded transition-colors"
                    >
                      New Target
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* Statistics Panel */}
            <div className="bg-white border border-gray-200 rounded p-4">
              <h3 className="text-base font-semibold mb-2 text-blue-700">Analytics</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded p-2 text-center">
                  <div className="text-lg font-bold text-blue-700">{statistics.comparisons}</div>
                  <div className="text-xs text-gray-500">Comparisons</div>
                </div>
                <div className="bg-gray-50 rounded p-2 text-center">
                  <div className="text-lg font-bold text-purple-700">{statistics.swaps}</div>
                  <div className="text-xs text-gray-500">Swaps</div>
                </div>
                <div className="bg-gray-50 rounded p-2 text-center">
                  <div className="text-lg font-bold text-green-700">{statistics.time}s</div>
                  <div className="text-xs text-gray-500">Time</div>
                </div>
                <div className="bg-gray-50 rounded p-2 text-center">
                  <div className="text-lg font-bold text-yellow-700">{statistics.operations}</div>
                  <div className="text-xs text-gray-500">Operations</div>
                </div>
              </div>
            </div>
          </div>
          {/* Completion Status */}
          {isCompleted && (
            <div className="text-center mt-2">
              <div className="inline-flex items-center gap-2 bg-green-100 border border-green-300 rounded px-4 py-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-700 font-medium text-sm">
                  {mode === 'search' 
                    ? searchResult >= 0 
                      ? `Target found at index ${searchResult}!` 
                      : 'Target not found in array.'
                    : 'Array successfully sorted!'
                  }
                </span>
              </div>
            </div>
          )}
        </main>
      </div>
      {/* Sidebar for code visualizer (20vw) */}
      <aside className="w-[20vw] min-w-[300px] max-w-[400px] bg-gray-50 border-l border-gray-200 p-6 flex flex-col h-screen overflow-y-auto">
        <h2 className="text-base font-semibold mb-3 text-blue-700">Algorithm Pseudocode</h2>
        <pre className="bg-gray-100 rounded p-4 font-mono text-sm text-gray-700 overflow-x-auto flex-1 whitespace-pre-wrap">
{pseudocodeMap[algorithm] || '// Pseudocode for this algorithm will appear here.'}
        </pre>
      </aside>
    </div>
  );
};

export default AlgorithmVisualizer;