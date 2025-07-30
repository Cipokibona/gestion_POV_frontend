import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-achat',
  imports: [FormsModule, CommonModule],
  templateUrl: './list-achat.html',
  styleUrl: './list-achat.scss'
})
export class ListAchat {
  @Input() data: any[] = [];
  @Input() columns: { key: string; label: string }[] = [];

  @Output() achat = new EventEmitter<any>();


  itemsPerPage = 10;
  currentPage = 1;

  get totalPages(): number {
    return Math.ceil(this.data.length / this.itemsPerPage);
  }

  get paginatedData(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.data.slice(start, start + this.itemsPerPage);
  }

  previousPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  onAchat(item: any) {
    item._achatConfirme = true;
    this.achat.emit(item);
  }

  champsRemplis(item: any): boolean {
    return (
      item.quantite > 0 &&
      item.prix_achat > 0 &&
      item.prix_vente > 0 &&
      !!item.date_expiration
    );
  }
}
