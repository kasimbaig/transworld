# Reusable Form Component

A modern, responsive, and feature-rich form component that can be used throughout the application. This component provides a centered modal dialog with full-screen toggle functionality.

## Features

- ✅ **Centered Modal Dialog**: Opens in the center of the screen with backdrop blur
- ✅ **Full-Screen Toggle**: Button to expand/collapse the form to full screen
- ✅ **Responsive Design**: Adapts to different screen sizes
- ✅ **Multiple Input Types**: Supports text, email, number, date, select, checkbox, textarea, and file upload
- ✅ **Form Validation**: Built-in validation with error messages
- ✅ **File Upload**: Drag & drop file upload with visual feedback
- ✅ **Dynamic Options**: Support for dynamic select options from APIs
- ✅ **Edit Mode**: Pre-populated forms for editing existing data
- ✅ **Modern UI**: Clean, modern design with smooth animations

## Usage

### Basic Implementation

```typescript
import { ReusableFormComponent } from './shared/components/reusable-form/reusable-form.component';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [ReusableFormComponent],
  template: `
    <button (click)="openForm()">Open Form</button>
    
    <app-reusable-form
      *ngIf="isFormOpen"
      [open]="isFormOpen"
      [formConfig]="formConfig"
      [formData]="formData"
      [formTitle]="'Add New Item'"
      [submitLabel]="'Save'"
      (onOpenChange)="isFormOpen = $event"
      (onSubmit)="handleSubmit($event)"
    ></app-reusable-form>
  `
})
export class MyComponent {
  isFormOpen = false;
  
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
      placeholder: 'Enter email'
    }
  ];
  
  formData = {
    name: '',
    email: ''
  };
  
  openForm() {
    this.isFormOpen = true;
  }
  
  handleSubmit(data: any) {
    console.log('Form submitted:', data);
    this.isFormOpen = false;
  }
}
```

### Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `open` | `boolean` | `false` | Controls form visibility |
| `formTitle` | `string` | `''` | Title displayed in the form header |
| `submitLabel` | `string` | `'Save'` | Text for the submit button |
| `isEditMode` | `boolean` | `false` | Enables edit mode with pre-populated data |
| `formData` | `any` | `{}` | Initial form data |
| `formConfig` | `FormField[]` | `[]` | Configuration for form fields |
| `context` | `'maintop' \| null \| 'sfd'` | `null` | Context for special behaviors |

### Form Field Configuration

Each field in `formConfig` should have the following structure:

```typescript
interface FormField {
  key: string;           // Unique identifier
  label: string;         // Display label
  type: 'text' | 'email' | 'number' | 'date' | 'select' | 'checkbox' | 'textarea' | 'file';
  required?: boolean;    // Whether field is required
  placeholder?: string;  // Placeholder text
  options?: any[];       // For select fields
  fullWidth?: boolean;   // Whether field spans full width
}
```

### Supported Field Types

1. **Text Inputs**: `text`, `email`, `number`
2. **Date Input**: `date`
3. **Select Dropdown**: `select` (requires `options` array)
4. **Checkbox**: `checkbox`
5. **Textarea**: `textarea`
6. **File Upload**: `file`

### Output Events

| Event | Type | Description |
|-------|------|-------------|
| `onOpenChange` | `EventEmitter<boolean>` | Emitted when form open state changes |
| `onSubmit` | `EventEmitter<any>` | Emitted when form is submitted |
| `fileSelected` | `EventEmitter<{key: string, file: File}>` | Emitted when file is selected |
| `fileDeleted` | `EventEmitter<number>` | Emitted when file is deleted |
| `documentFileDeleted` | `EventEmitter<number>` | Emitted when document file is deleted |

### Advanced Features

#### Dynamic Options for Select Fields

```typescript
formConfig = [
  {
    key: 'category',
    label: 'Category',
    type: 'select',
    required: true,
    options: this.apiService.getCategories() // Observable
  }
];
```

#### File Upload with Drag & Drop

```typescript
formConfig = [
  {
    key: 'document',
    label: 'Upload Document',
    type: 'file',
    required: false
  }
];
```

#### Full Width Fields

```typescript
formConfig = [
  {
    key: 'description',
    label: 'Description',
    type: 'textarea',
    fullWidth: true, // Spans full width
    required: false
  }
];
```

### Styling

The component uses CSS custom properties for theming. You can override these in your global styles:

```css
:root {
  --primary-gradient-start: #667eea;
  --primary-gradient-end: #1e40af;
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --text-primary: #333333;
  --border-light: #e9ecef;
  --shadow-light: rgba(0, 0, 0, 0.1);
  --shadow-medium: rgba(0, 0, 0, 0.15);
  --shadow-dark: rgba(0, 0, 0, 0.2);
}
```

### Responsive Behavior

- **Desktop**: 3-column grid layout in full-screen mode
- **Tablet**: 2-column grid layout
- **Mobile**: Single column layout with optimized spacing

### Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Accessibility

- Keyboard navigation support
- Screen reader friendly
- ARIA labels and roles
- Focus management
- High contrast support

## Migration from AddFormComponent

To migrate from the old `AddFormComponent` to the new `ReusableFormComponent`:

1. **Update Import**:
   ```typescript
   // Old
   import { AddFormComponent } from './add-form/add-form.component';
   
   // New
   import { ReusableFormComponent } from './reusable-form/reusable-form.component';
   ```

2. **Update Template**:
   ```html
   <!-- Old -->
   <app-add-form [fromTitle]="title" ...></app-add-form>
   
   <!-- New -->
   <app-reusable-form [formTitle]="title" ...></app-reusable-form>
   ```

3. **Update Component Imports**:
   ```typescript
   // Old
   imports: [AddFormComponent, ...]
   
   // New
   imports: [ReusableFormComponent, ...]
   ```

## Examples

See `reusable-form-demo.component.ts` for a complete working example.

## Troubleshooting

### Common Issues

1. **Form not opening**: Ensure `[open]="true"` is set
2. **Validation errors**: Check that required fields are properly configured
3. **File upload not working**: Ensure proper event handlers are set up
4. **Styling issues**: Check CSS custom properties are defined

### Performance Tips

- Use `OnPush` change detection strategy for better performance
- Lazy load form configurations when possible
- Debounce form submissions for large datasets 