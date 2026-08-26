export type ContactFieldType = 'text' | 'email' | 'textarea' | 'select';

export interface ContactFieldOption {
  value: string;
  label: string;
}

export interface ContactField {
  id: string;
  label: string;
  type: ContactFieldType;
  required: boolean;
  autocomplete?: string;
  rows?: number;
  placeholder?: string;
}

export interface InquiryType {
  id: string;
  label: string;
  subjectPrefix: string;
  blurb: string;
  fields: ContactField[];
}

export interface ContactBaseFields {
  name: ContactField;
  email: ContactField;
  message: ContactField;
}

export interface ContactFormConfig {
  action: string;
  inquiry: ContactField;
  baseFields: ContactBaseFields;
  inquiryTypes: InquiryType[];
  submitText: string;
}

export interface ContactConfig {
  form: ContactFormConfig;
  successMessage: {
    title: string;
    text: string;
  };
}
