import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-confirmation-modal',
  imports: [CommonModule],
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrl: './delete-confirmation-modal.component.css'
})
export class DeleteConfirmationModalComponent {
  @Input() visible: boolean = false;
  @Input() message: string = 'Are you sure you want to delete this item?';
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();
  @Input() itemName: string = '';
}
