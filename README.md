# Algorithm Visualizer 

A beautiful, interactive, and educational web app for visualizing sorting and searching algorithms. See how algorithms work step-by-step, with animated bars, color-coded states, analytics, pseudocode, and more!

---

## 🚀 Features

- **Visualize 16+ sorting and 6+ searching algorithms**
- **Step-by-step animation** of array operations
- **Color-coded bars** for comparing, swapping, sorted, pivot, merging, current, found, path, min/max, etc.
- **Detailed legend** with icons for every state
- **Collector card**: algorithm name, description, analytics (comparisons, swaps, time), and pseudocode
- **Always-present search target**: whatever you enter, the value is guaranteed to be in the array
- **Responsive, modern UI** with beautiful transitions
- **No disappearing bars or visual bugs**
- **Accessible and user-friendly**

---

## 🧮 Supported Algorithms

### Sorting Algorithms
- Bubble Sort
- Selection Sort
- Insertion Sort
- Merge Sort
- Quick Sort
- Heap Sort
- Gnome Sort
- Pancake Sort
- Comb Sort
- Odd-Even Sort
- Shell Sort
- Bitonic Sort (auto-adjusts array size to power of two)
- Bogo Sort
- Radix Sort
- Decide Sort (Randomized Quick Sort)
- Salt Shaker Sort (Cocktail/Shaker Sort)

### Searching Algorithms
- Linear Search
- Binary Search
- Jump Search
- Interpolation Search
- Exponential Search
- Fibonacci Search

---

## 🎨 How the Visualization Works

- **Bars**: Each array element is a vertical bar. The height represents its value.
- **Colors**: Each algorithm uses a unique color scheme for states like comparing, swapping, sorted, pivot, merging, current, found, path, min, max, etc.
- **Legend**: Below the visualization, a legend shows every color and its meaning, with an icon for each state (e.g., ✅ for sorted, ↔️ for swapped, 🔄 for comparing, 🔎 for current, etc.).
- **Animation**: Bars animate their height and color smoothly as the algorithm progresses. No left-right movement (for maximum stability and clarity).
- **Collector Card**: Below the legend, a card shows the algorithm name, mode, description, analytics (comparisons, swaps, time), and pseudocode.
- **Analytics**: Live counts of comparisons, swaps, and elapsed time are shown for every run.
- **Always-present search target**: If you enter a value not in the array, it is automatically inserted at a random position, so the search always succeeds.

---

## 🕹️ How to Use

1. **Choose a mode**: Sorting or Searching (dropdown at the top)
2. **Select an algorithm**: Pick from the dropdown (options change by mode)
3. **Adjust array size and speed**: Use the sliders
4. **(Search only) Set the search target**: Enter any value; it will be added to the array if not present
5. **Controls**:
   - **Play**: Animate the algorithm
   - **Pause**: Stop animation
   - **Step**: Advance one step
   - **Reset**: Reset to original array
   - **Shuffle**: Shuffle the array
6. **Watch the bars**: Colors and legend show exactly what the algorithm is doing
7. **Read the collector card**: See analytics, description, and pseudocode for the current algorithm

---

## 🛠️ Technologies Used

- **React** (functional components, hooks)
- **TypeScript** (type safety)
- **CSS transitions** (for smooth bar animation)
- **Modern, modular UI**

---



## ⚡ Running Locally

1. **Clone the repo**
   ```bash
   git clone <repo-url>
   cd sorter
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Start the app**
   ```bash
   npm start
   ```
4. **Open in your browser**
   - Go to [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal)

---

## 🤝 Credits

- Algorithm implementations and visualization: Sasidhar Jasty


---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

---

## 💡 Tips & Notes

- **Bitonic Sort**: Only works with array sizes that are a power of two. The app will auto-adjust and warn you if needed.
- **Search Target**: You can enter any value; it will always be present in the array for searching.
- **No disappearing bars**: The app is robust against all visual bugs.
- **Try all algorithms**: Each one has a unique color scheme and legend!

---

Enjoy learning and exploring algorithms visually! 🚀
