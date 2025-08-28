import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-reusable-from',
  imports: [DialogModule],
  templateUrl: './reusable-from.component.html',
  styleUrl: './reusable-from.component.css',
})
export class ReusableFromComponent {
  @Input() visible: boolean = false;
  @Input() dialogWidth: string = '50vw';
  @Input() header: string = 'Dialog';

  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onSave() {
    this.save.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
