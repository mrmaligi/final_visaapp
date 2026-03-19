// Form field types supported by the dynamic form builder
export type FormFieldType = 
  | 'text' 
  | 'textarea' 
  | 'email' 
  | 'tel' 
  | 'number' 
  | 'date' 
  | 'select' 
  | 'multiselect'
  | 'checkbox' 
  | 'radio' 
  | 'switch'
  | 'file'
  | 'files'
  | 'address'
  | 'country'
  | 'passport'
  | 'section'
  | 'repeatable'
  | 'divider'
  | 'heading'
  | 'paragraph';

// Validation rules
export interface ValidationRule {
  type: 'required' | 'email' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: number | string | boolean;
  message: string;
}

// Option for select/radio/checkbox fields
export interface FieldOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

// Conditional visibility rule
export interface ConditionalRule {
  field: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'notContains' | 'greaterThan' | 'lessThan' | 'isEmpty' | 'isNotEmpty';
  value?: string | number | boolean | string[];
}

// Individual form field definition
export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  defaultValue?: unknown;
  options?: FieldOption[];
  validation?: ValidationRule[];
  conditional?: ConditionalRule[];
  disabled?: boolean;
  readOnly?: boolean;
  hidden?: boolean;
  
  // Type-specific properties
  min?: number;
  max?: number;
  step?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  accept?: string; // For file inputs
  maxFiles?: number;
  maxFileSize?: number; // In bytes
  rows?: number; // For textarea
  cols?: number;
  
  // Nested fields for section/repeatable
  fields?: FormField[];
  
  // Styling
  width?: 'full' | 'half' | 'third' | 'quarter';
  className?: string;
}

// Form section (page/step in multi-step forms)
export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  conditional?: ConditionalRule[];
}

// Complete form schema
export interface FormSchema {
  id: string;
  title: string;
  description?: string;
  version: string;
  sections: FormSection[];
  
  // Form configuration
  config?: {
    multiStep?: boolean;
    showProgressBar?: boolean;
    allowSaveAndExit?: boolean;
    autoSaveInterval?: number; // In seconds, 0 to disable
    submitLabel?: string;
    nextLabel?: string;
    backLabel?: string;
    saveLabel?: string;
  };
}

// Form progress tracking
export interface FormProgress {
  currentSection: number;
  currentField?: string;
  completedFields: string[];
  visitedSections: string[];
  lastSaved?: string;
  percentage: number;
}

// Form validation error
export interface FormError {
  field: string;
  message: string;
  type: string;
}

// Form submission data
export interface FormSubmission {
  formId: string;
  formVersion: string;
  data: Record<string, unknown>;
  progress: FormProgress;
  submittedAt?: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
}

// Auto-save state
export interface AutoSaveState {
  isSaving: boolean;
  lastSaved: string | null;
  hasUnsavedChanges: boolean;
  error: string | null;
}

// Helper to evaluate conditional rules
export function evaluateConditional(
  rules: ConditionalRule[], 
  formData: Record<string, unknown>
): boolean {
  if (!rules || rules.length === 0) return true;
  
  return rules.every(rule => {
    const fieldValue = formData[rule.field];
    
    switch (rule.operator) {
      case 'equals':
        return fieldValue === rule.value;
      case 'notEquals':
        return fieldValue !== rule.value;
      case 'contains':
        if (Array.isArray(fieldValue)) {
          return fieldValue.includes(rule.value as string);
        }
        return String(fieldValue).includes(String(rule.value));
      case 'notContains':
        if (Array.isArray(fieldValue)) {
          return !fieldValue.includes(rule.value as string);
        }
        return !String(fieldValue).includes(String(rule.value));
      case 'greaterThan':
        return Number(fieldValue) > Number(rule.value);
      case 'lessThan':
        return Number(fieldValue) < Number(rule.value);
      case 'isEmpty':
        return fieldValue === undefined || fieldValue === null || fieldValue === '' || 
               (Array.isArray(fieldValue) && fieldValue.length === 0);
      case 'isNotEmpty':
        return fieldValue !== undefined && fieldValue !== null && fieldValue !== '' &&
               (!Array.isArray(fieldValue) || fieldValue.length > 0);
      default:
        return true;
    }
  });
}

// Helper to validate a single field
export function validateField(
  field: FormField, 
  value: unknown
): FormError | null {
  if (!field.validation) return null;
  
  for (const rule of field.validation) {
    let isValid = true;
    
    switch (rule.type) {
      case 'required':
        isValid = value !== undefined && value !== null && value !== '' &&
                  (!Array.isArray(value) || value.length > 0);
        break;
      case 'email':
        if (value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          isValid = emailRegex.test(String(value));
        }
        break;
      case 'min':
        if (value !== undefined && value !== null) {
          isValid = Number(value) >= Number(rule.value);
        }
        break;
      case 'max':
        if (value !== undefined && value !== null) {
          isValid = Number(value) <= Number(rule.value);
        }
        break;
      case 'minLength':
        if (value) {
          isValid = String(value).length >= Number(rule.value);
        }
        break;
      case 'maxLength':
        if (value) {
          isValid = String(value).length <= Number(rule.value);
        }
        break;
      case 'pattern':
        if (value) {
          const regex = new RegExp(String(rule.value));
          isValid = regex.test(String(value));
        }
        break;
    }
    
    if (!isValid) {
      return { field: field.id, message: rule.message, type: rule.type };
    }
  }
  
  return null;
}

// Helper to validate entire form
export function validateForm(
  schema: FormSchema, 
  data: Record<string, unknown>
): FormError[] {
  const errors: FormError[] = [];
  
  for (const section of schema.sections) {
    for (const field of section.fields) {
      // Skip hidden/conditional fields
      if (field.conditional && !evaluateConditional(field.conditional, data)) {
        continue;
      }
      
      const error = validateField(field, data[field.id]);
      if (error) {
        errors.push(error);
      }
      
      // Validate nested fields for sections
      if (field.fields) {
        for (const nestedField of field.fields) {
          const nestedError = validateField(nestedField, data[nestedField.id]);
          if (nestedError) {
            errors.push(nestedError);
          }
        }
      }
    }
  }
  
  return errors;
}

// Calculate form progress
export function calculateProgress(
  schema: FormSchema, 
  data: Record<string, unknown>,
  currentSection: number
): FormProgress {
  let totalFields = 0;
  let completedFields: string[] = [];
  const visitedSections: string[] = [];
  
  schema.sections.forEach((section, index) => {
    if (index <= currentSection) {
      visitedSections.push(section.id);
    }
    
    for (const field of section.fields) {
      if (field.conditional && !evaluateConditional(field.conditional, data)) {
        continue;
      }
      
      if (field.type !== 'divider' && field.type !== 'heading' && field.type !== 'paragraph') {
        totalFields++;
        
        const value = data[field.id];
        if (value !== undefined && value !== null && value !== '' &&
            (!Array.isArray(value) || value.length > 0)) {
          completedFields.push(field.id);
        }
      }
    }
  });
  
  return {
    currentSection,
    completedFields,
    visitedSections,
    percentage: totalFields > 0 ? Math.round((completedFields.length / totalFields) * 100) : 0,
  };
}

// Sample form schema for visa application
export const sampleVisaFormSchema: FormSchema = {
  id: 'skilled-independent-189',
  title: 'Skilled Independent Visa (Subclass 189)',
  description: 'Complete all sections of this form to apply for your visa',
  version: '1.0.0',
  config: {
    multiStep: true,
    showProgressBar: true,
    allowSaveAndExit: true,
    autoSaveInterval: 30,
    submitLabel: 'Submit Application',
    nextLabel: 'Continue',
    backLabel: 'Back',
    saveLabel: 'Save Progress',
  },
  sections: [
    {
      id: 'personal-details',
      title: 'Personal Details',
      description: 'Provide your basic personal information',
      fields: [
        {
          id: 'heading-1',
          type: 'heading',
          label: 'Personal Information',
          width: 'full',
        },
        {
          id: 'title',
          type: 'select',
          label: 'Title',
          options: [
            { label: 'Mr', value: 'mr' },
            { label: 'Mrs', value: 'mrs' },
            { label: 'Ms', value: 'ms' },
            { label: 'Miss', value: 'miss' },
            { label: 'Dr', value: 'dr' },
          ],
          validation: [{ type: 'required', message: 'Title is required' }],
          width: 'quarter',
        },
        {
          id: 'firstName',
          type: 'text',
          label: 'First Name',
          placeholder: 'Enter your first name',
          validation: [
            { type: 'required', message: 'First name is required' },
            { type: 'maxLength', value: 100, message: 'Maximum 100 characters' },
          ],
          width: 'half',
        },
        {
          id: 'lastName',
          type: 'text',
          label: 'Last Name',
          placeholder: 'Enter your last name',
          validation: [
            { type: 'required', message: 'Last name is required' },
            { type: 'maxLength', value: 100, message: 'Maximum 100 characters' },
          ],
          width: 'half',
        },
        {
          id: 'dateOfBirth',
          type: 'date',
          label: 'Date of Birth',
          validation: [{ type: 'required', message: 'Date of birth is required' }],
          width: 'half',
        },
        {
          id: 'gender',
          type: 'radio',
          label: 'Gender',
          options: [
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
            { label: 'Other', value: 'other' },
          ],
          validation: [{ type: 'required', message: 'Gender is required' }],
          width: 'half',
        },
        {
          id: 'divider-1',
          type: 'divider',
          label: '',
          width: 'full',
        },
        {
          id: 'heading-2',
          type: 'heading',
          label: 'Contact Information',
          width: 'full',
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email Address',
          placeholder: 'your.email@example.com',
          validation: [
            { type: 'required', message: 'Email is required' },
            { type: 'email', message: 'Please enter a valid email' },
          ],
          width: 'half',
        },
        {
          id: 'phone',
          type: 'tel',
          label: 'Phone Number',
          placeholder: '+61 XXX XXX XXX',
          validation: [{ type: 'required', message: 'Phone number is required' }],
          width: 'half',
        },
      ],
    },
    {
      id: 'passport-details',
      title: 'Passport Details',
      description: 'Enter your passport information',
      fields: [
        {
          id: 'hasPassport',
          type: 'switch',
          label: 'Do you have a valid passport?',
          defaultValue: true,
          width: 'full',
        },
        {
          id: 'passportNumber',
          type: 'text',
          label: 'Passport Number',
          placeholder: 'e.g., N12345678',
          validation: [
            { type: 'required', message: 'Passport number is required' },
            { type: 'pattern', value: '^[A-Z0-9]{6,9}$', message: 'Invalid passport number format' },
          ],
          conditional: [{ field: 'hasPassport', operator: 'equals', value: true }],
          width: 'half',
        },
        {
          id: 'passportCountry',
          type: 'country',
          label: 'Country of Issue',
          validation: [{ type: 'required', message: 'Country is required' }],
          conditional: [{ field: 'hasPassport', operator: 'equals', value: true }],
          width: 'half',
        },
        {
          id: 'passportExpiry',
          type: 'date',
          label: 'Expiry Date',
          validation: [{ type: 'required', message: 'Expiry date is required' }],
          conditional: [{ field: 'hasPassport', operator: 'equals', value: true }],
          width: 'half',
        },
        {
          id: 'passportScan',
          type: 'file',
          label: 'Passport Scan',
          accept: '.pdf,.jpg,.jpeg,.png',
          helpText: 'Upload a clear scan of your passport photo page (max 10MB)',
          validation: [{ type: 'required', message: 'Passport scan is required' }],
          conditional: [{ field: 'hasPassport', operator: 'equals', value: true }],
          width: 'full',
        },
      ],
    },
    {
      id: 'address-history',
      title: 'Address History',
      description: 'Provide your residential address history for the past 10 years',
      fields: [
        {
          id: 'currentAddress',
          type: 'address',
          label: 'Current Residential Address',
          validation: [{ type: 'required', message: 'Current address is required' }],
          width: 'full',
        },
        {
          id: 'livedAtCurrentAddressYears',
          type: 'number',
          label: 'Years at this address',
          min: 0,
          max: 100,
          validation: [{ type: 'required', message: 'Required' }],
          width: 'quarter',
        },
        {
          id: 'hasPreviousAddresses',
          type: 'switch',
          label: 'Have you lived at other addresses in the past 10 years?',
          defaultValue: false,
          width: 'full',
        },
        {
          id: 'previousAddresses',
          type: 'repeatable',
          label: 'Previous Addresses',
          helpText: 'Add all addresses where you have lived in the past 10 years',
          conditional: [{ field: 'hasPreviousAddresses', operator: 'equals', value: true }],
          width: 'full',
          fields: [
            {
              id: 'address',
              type: 'address',
              label: 'Address',
              validation: [{ type: 'required', message: 'Address is required' }],
            },
            {
              id: 'fromDate',
              type: 'date',
              label: 'From',
              validation: [{ type: 'required', message: 'From date is required' }],
            },
            {
              id: 'toDate',
              type: 'date',
              label: 'To',
              validation: [{ type: 'required', message: 'To date is required' }],
            },
          ],
        },
      ],
    },
    {
      id: 'employment-history',
      title: 'Employment History',
      description: 'Detail your work experience',
      fields: [
        {
          id: 'currentEmployment',
          type: 'section',
          label: 'Current Employment',
          width: 'full',
          fields: [
            {
              id: 'employerName',
              type: 'text',
              label: 'Employer Name',
              validation: [{ type: 'required', message: 'Employer name is required' }],
            },
            {
              id: 'jobTitle',
              type: 'text',
              label: 'Job Title',
              validation: [{ type: 'required', message: 'Job title is required' }],
            },
            {
              id: 'employmentType',
              type: 'select',
              label: 'Employment Type',
              options: [
                { label: 'Full-time', value: 'full-time' },
                { label: 'Part-time', value: 'part-time' },
                { label: 'Casual', value: 'casual' },
                { label: 'Contract', value: 'contract' },
                { label: 'Self-employed', value: 'self-employed' },
              ],
              validation: [{ type: 'required', message: 'Employment type is required' }],
            },
            {
              id: 'startDate',
              type: 'date',
              label: 'Start Date',
              validation: [{ type: 'required', message: 'Start date is required' }],
            },
            {
              id: 'employerAddress',
              type: 'address',
              label: 'Employer Address',
              validation: [{ type: 'required', message: 'Employer address is required' }],
            },
          ],
        },
        {
          id: 'previousEmployment',
          type: 'repeatable',
          label: 'Previous Employment',
          helpText: 'List any previous employment in the past 10 years',
          width: 'full',
          fields: [
            {
              id: 'employerName',
              type: 'text',
              label: 'Employer Name',
              validation: [{ type: 'required', message: 'Employer name is required' }],
            },
            {
              id: 'jobTitle',
              type: 'text',
              label: 'Job Title',
              validation: [{ type: 'required', message: 'Job title is required' }],
            },
            {
              id: 'fromDate',
              type: 'date',
              label: 'From',
              validation: [{ type: 'required', message: 'From date is required' }],
            },
            {
              id: 'toDate',
              type: 'date',
              label: 'To',
              validation: [{ type: 'required', message: 'To date is required' }],
            },
          ],
        },
      ],
    },
    {
      id: 'qualifications',
      title: 'Qualifications',
      description: 'List your educational qualifications',
      fields: [
        {
          id: 'highestQualification',
          type: 'select',
          label: 'Highest Qualification',
          options: [
            { label: 'Doctorate/PhD', value: 'phd' },
            { label: 'Masters Degree', value: 'masters' },
            { label: 'Bachelor Degree', value: 'bachelor' },
            { label: 'Diploma', value: 'diploma' },
            { label: 'Certificate', value: 'certificate' },
            { label: 'Trade Qualification', value: 'trade' },
          ],
          validation: [{ type: 'required', message: 'Highest qualification is required' }],
          width: 'half',
        },
        {
          id: 'fieldOfStudy',
          type: 'text',
          label: 'Field of Study',
          placeholder: 'e.g., Computer Science',
          validation: [{ type: 'required', message: 'Field of study is required' }],
          width: 'half',
        },
        {
          id: 'qualificationsList',
          type: 'repeatable',
          label: 'Qualifications',
          helpText: 'Add all relevant qualifications',
          width: 'full',
          fields: [
            {
              id: 'qualificationName',
              type: 'text',
              label: 'Qualification Name',
              validation: [{ type: 'required', message: 'Required' }],
            },
            {
              id: 'institution',
              type: 'text',
              label: 'Institution',
              validation: [{ type: 'required', message: 'Required' }],
            },
            {
              id: 'country',
              type: 'country',
              label: 'Country',
              validation: [{ type: 'required', message: 'Required' }],
            },
            {
              id: 'yearCompleted',
              type: 'number',
              label: 'Year Completed',
              min: 1950,
              max: new Date().getFullYear(),
              validation: [{ type: 'required', message: 'Required' }],
            },
          ],
        },
      ],
    },
    {
      id: 'documents',
      title: 'Supporting Documents',
      description: 'Upload all required supporting documents',
      fields: [
        {
          id: 'documentsIntro',
          type: 'paragraph',
          label: 'Please ensure all documents are clear, legible scans or photos. Each file must be less than 10MB.',
          width: 'full',
        },
        {
          id: 'identityDocuments',
          type: 'files',
          label: 'Identity Documents',
          helpText: 'Upload passport, birth certificate, or national ID',
          accept: '.pdf,.jpg,.jpeg,.png',
          maxFiles: 5,
          maxFileSize: 10 * 1024 * 1024,
          validation: [{ type: 'required', message: 'At least one identity document is required' }],
          width: 'full',
        },
        {
          id: 'qualificationDocuments',
          type: 'files',
          label: 'Qualification Documents',
          helpText: 'Upload degree certificates, transcripts, etc.',
          accept: '.pdf,.jpg,.jpeg,.png',
          maxFiles: 10,
          maxFileSize: 10 * 1024 * 1024,
          width: 'full',
        },
        {
          id: 'employmentDocuments',
          type: 'files',
          label: 'Employment Documents',
          helpText: 'Upload employment contracts, reference letters, payslips',
          accept: '.pdf,.jpg,.jpeg,.png',
          maxFiles: 10,
          maxFileSize: 10 * 1024 * 1024,
          width: 'full',
        },
        {
          id: 'englishTestResults',
          type: 'files',
          label: 'English Language Test Results',
          helpText: 'IELTS, PTE, TOEFL, or other approved test results',
          accept: '.pdf,.jpg,.jpeg,.png',
          maxFiles: 3,
          maxFileSize: 10 * 1024 * 1024,
          width: 'full',
        },
      ],
    },
    {
      id: 'review',
      title: 'Review & Submit',
      description: 'Review your application before submitting',
      fields: [
        {
          id: 'declaration',
          type: 'checkbox',
          label: 'I declare that the information provided is true and correct',
          options: [
            { 
              label: 'I confirm that all information provided in this application is true and complete to the best of my knowledge. I understand that providing false or misleading information may result in the refusal of my application.',
              value: 'confirmed'
            },
          ],
          validation: [{ type: 'required', message: 'You must confirm to proceed' }],
          width: 'full',
        },
      ],
    },
  ],
};
