import { Component } from '@angular/core';
import { ReusableFormComponent } from './reusable-form.component';

@Component({
  selector: 'app-reusable-form-demo',
  standalone: true,
  imports: [ReusableFormComponent],
  template: `
    <div class="demo-container">
      <h2>Reusable Form Demo</h2>
      <p>This demonstrates the new reusable form component with full-screen toggle functionality.</p>
      
      <button (click)="openAddForm()" class="demo-button">
        <i class="pi pi-plus"></i> Open Add Form
      </button>
      
      <button (click)="openEditForm()" class="demo-button">
        <i class="pi pi-pencil"></i> Open Edit Form
      </button>
    </div>

    <!-- Add Form -->
    <app-reusable-form
      *ngIf="isAddFormOpen"
      [open]="isAddFormOpen"
      [formConfig]="formConfig"
      [formData]="formData"
      [formTitle]="'Add New Item'"
      [submitLabel]="'Create Item'"
      (onOpenChange)="isAddFormOpen = $event"
      (onSubmit)="handleSubmit($event)"
    ></app-reusable-form>

    <!-- Edit Form -->
    <app-reusable-form
      *ngIf="isEditFormOpen"
      [open]="isEditFormOpen"
      [formConfig]="formConfig"
      [formData]="editFormData"
      [formTitle]="'Edit Item'"
      [submitLabel]="'Update Item'"
      [isEditMode]="true"
      (onOpenChange)="isEditFormOpen = $event"
      (onSubmit)="handleEditSubmit($event)"
    ></app-reusable-form>
  `,
  styles: [`
    .demo-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .demo-button {
      background: linear-gradient(135deg, #667eea 0%, #1e40af 100%);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-right: 1rem;
      margin-bottom: 1rem;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .demo-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
  `]
})
export class ReusableFormDemoComponent {
  isAddFormOpen = false;
  isEditFormOpen = false;

  formConfig = [
    {
      key: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      placeholder: 'Enter name'
    },
    {
      key: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'Enter email address'
    },
    {
      key: 'phone',
      label: 'Phone',
      type: 'text',
      required: false,
      placeholder: 'Enter phone number'
    },
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      required: true,
      placeholder: 'Select category',
      options: [
        { label: 'Technology', value: 'tech' },
        { label: 'Business', value: 'business' },
        { label: 'Education', value: 'education' },
        { label: 'Healthcare', value: 'healthcare' }
      ]
    },
    {
      key: 'description',
      label: 'Description',
      type: 'textarea',
      required: false,
      placeholder: 'Enter description',
      fullWidth: true
    },
    {
      key: 'active',
      label: 'Active',
      type: 'checkbox',
      required: false,
      placeholder: 'Mark as active'
    },
    {
      key: 'birthDate',
      label: 'Birth Date',
      type: 'date',
      required: false,
      placeholder: 'Select birth date'
    },
    {
      key: 'document',
      label: 'Document',
      type: 'file',
      required: false,
      placeholder: 'Upload document'
    }
  ];

  formData = {
    name: '',
    email: '',
    phone: '',
    category: '',
    description: '',
    active: false,
    birthDate: '',
    document: null
  };

  editFormData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    category: 'tech',
    description: 'This is a sample description for editing.',
    active: true,
    birthDate: '1990-01-01',
    document: null
  };

  openAddForm() {
    this.isAddFormOpen = true;
    this.isEditFormOpen = false;
  }

  openEditForm() {
    this.isEditFormOpen = true;
    this.isAddFormOpen = false;
  }

  handleSubmit(data: any) {
    console.log('Add form submitted:', data);
    alert('Add form submitted successfully!');
    this.isAddFormOpen = false;
  }

  handleEditSubmit(data: any) {
    console.log('Edit form submitted:', data);
    alert('Edit form submitted successfully!');
    this.isEditFormOpen = false;
  }
} 