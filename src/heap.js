class Heap{
    constructor() {
      this.heap = [];
    }
  
    getParentIndex(index) {
      return Math.floor((index - 1) / 2);
    }
  
    getLeftChildIndex(index) {
      return 2 * index + 1;
    }
  
    getRightChildIndex(index) {
      return 2 * index + 2;
    }
  
    swap(index1, index2) {
      [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
    }
  
    insert(value) {
      this.heap.push(value);
      this.heapifyUp(this.heap.length - 1);
    }
  
    heapifyUp(index) {
      while (index > 0 && this.heap[index].duration < this.heap[this.getParentIndex(index)].duration) {
        const parentIndex = this.getParentIndex(index);
        this.swap(index, parentIndex);
        index = parentIndex;
      }
    }
  
    extractMin() {
      if (this.isEmpty()) {
        return null;
      }
  
      const minValue = this.heap[0];
      this.heap[0] = this.heap.pop();
      this.heapifyDown(0);
      return minValue;
    }
  
    heapifyDown(index) {
      let smallest = index;
      const leftChildIndex = this.getLeftChildIndex(index);
      const rightChildIndex = this.getRightChildIndex(index);
  
      if (leftChildIndex < this.heap.length && this.heap[leftChildIndex].duration < this.heap[smallest].duration) {
        smallest = leftChildIndex;
      }
  
      if (rightChildIndex < this.heap.length && this.heap[rightChildIndex].duration < this.heap[smallest].duration) {
        smallest = rightChildIndex;
      }
  
      if (smallest !== index) {
        this.swap(index, smallest);
        this.heapifyDown(smallest);
      }
    }
  
    isEmpty() {
      return this.heap.length === 0;
    }
  
    peekMin() {
      return this.isEmpty() ? null : this.heap[0];
    }
  
    size() {
      return this.heap.length;
    }
  }

module.exports = {Heap};