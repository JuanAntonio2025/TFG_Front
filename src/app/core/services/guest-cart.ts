import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GuestCart {
  private readonly storageKey = 'guest_cart_items';

  getItems(): number[] {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  saveItems(items: number[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  addItem(bookId: number): boolean {
    const items = this.getItems();

    if (items.includes(bookId)) {
      return false;
    }

    items.push(bookId);
    this.saveItems(items);
    return true;
  }

  removeItem(bookId: number): void {
    const items = this.getItems().filter(id => id !== bookId);
    this.saveItems(items);
  }

  clear(): void {
    localStorage.removeItem(this.storageKey);
  }

  count(): number {
    return this.getItems().length;
  }
}
