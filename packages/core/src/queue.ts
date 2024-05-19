export class Queue<T> {
  private items: T[] = [];
  private _onPush: ((item: T) => void) | null = null;

  pop() {
    return this.items.shift();
  }

  push(item: T) {
    this.items.push(item);
    this._onPush?.(item);
  }

  size() {
    return this.items.length;
  }

  onPush(callback: (item: T) => void) {
    this._onPush = callback;
  }
}
