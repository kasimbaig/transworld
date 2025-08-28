import { Department } from './department.model'; // Import if not already done

export interface Section {
  sfd_hierarchy: boolean | null;
  id?: number;
  active?: number;
  code: string;
  name: string;
  department: Department | number | any; // Can be a full object or just the ID for creation/update
  created_by?: number;
}