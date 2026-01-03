// Contact form types

export interface FormField {
  label: string;
  type: string;
  required: boolean;
  autocomplete?: string;
  rows?: number;
}

export interface ContactConfig {
  intro: string;
  form: {
    action: string;
    fields: {
      name: FormField;
      email: FormField;
      subject: FormField;
      message: FormField;
    };
    submitText: string;
  };
  successMessage: {
    title: string;
    text: string;
  };
}
