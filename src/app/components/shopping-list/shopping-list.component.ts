import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ShoppingListService } from '../../services/shopping-list.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  shoppingList: any[] = [];
  selectedItems = new Set<any>();

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    this.loadShoppingList();
  }

  loadShoppingList(): void {
    this.shoppingListService.getShoppingList().subscribe({
      next: (data) => {
        console.log('Loaded shopping list:', data);
        this.shoppingList = data;
      },
      error: (err) => {
        console.error('Error loading list:', err);
        alert('Error loading shopping list! Check console for details.');
      }
    });
  }

  markSelectedAsPurchased(): void {
    const requests = Array.from(this.selectedItems).map(item => {
      const updatedItem = { ...item, purchased: true };
      return this.shoppingListService.updateItem(item.id, updatedItem);
    });

    forkJoin(requests).subscribe({
      next: () => {
        this.loadShoppingList();
        this.selectedItems.clear();
      },
      error: (err) => {
        console.error('Bulk update error:', err);
        alert('Error marking items as purchased!');
      }
    });
  }

  deleteSelected(): void {
    if (confirm(`Delete ${this.selectedItems.size} selected items?`)) {
      const requests = Array.from(this.selectedItems).map(item => 
        this.shoppingListService.deleteItem(item.id)
      );

      forkJoin(requests).subscribe({
        next: () => {
          this.loadShoppingList();
          this.selectedItems.clear();
        },
        error: (err) => {
          console.error('Bulk delete error:', err);
          alert('Error deleting selected items!');
        }
      });
    }
  }

  togglePurchased(item: any): void {
    const updatedItem = { ...item, purchased: !item.purchased };
    this.shoppingListService.updateItem(item.id, updatedItem).subscribe({
      next: () => {
        console.log('Updated item:', updatedItem);
        this.loadShoppingList();
      },
      error: (err) => {
        console.error('Update error:', err);
        alert('Error updating item! Check console for details.');
      }
    });
  }

  deleteItem(itemId: number): void {
      this.shoppingListService.deleteItem(itemId).subscribe({
        next: () => {
          console.log('Deleted item ID:', itemId);
          this.loadShoppingList();
        },
        error: (err) => {
          console.error('Delete error:', err);
          alert('Error deleting item! Check console for details.');
        }
      });
  }

  toggleSelection(item: any): void {
    this.selectedItems.has(item) 
      ? this.selectedItems.delete(item) 
      : this.selectedItems.add(item);
    console.log('Selected items:', this.selectedItems);
  }

  transferPurchasedItems(): void {
    if (confirm('Transfer all purchased items to ingredients?')) {
      this.shoppingListService.transferPurchasedItems().subscribe({
        next: () => {
          alert('Items transferred successfully!');
          this.clearPurchasedItems();
        },
        error: (err) => console.error('Transfer error:', err)
      });
    }
  }

  private clearPurchasedItems(): void {
    const purchasedIds = this.shoppingList
      .filter(item => item.purchased)
      .map(item => item.id);
  
    const deleteRequests = purchasedIds.map(id => 
      this.shoppingListService.deleteItem(id)
    );
  
    forkJoin(deleteRequests).subscribe({
      next: () => this.loadShoppingList(),
      error: (err) => console.error('Cleanup error:', err)
    });
  }

}