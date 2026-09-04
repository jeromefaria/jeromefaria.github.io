import type { ContactFormConfig, InquiryType } from '@/types/contact';

export interface ContactPayload {
  token: string;
  inquiry: string;
  name: string;
  email: string;
  message: string;
  fields: { label: string; value: string }[];
  botField: string;
}

export const buildContactPayload = (
  form: ContactFormConfig,
  formData: Record<string, string>,
  selectedType: InquiryType | null,
  token: string,
  botField: string,
): ContactPayload => ({
  token,
  inquiry: selectedType?.label ?? '',
  name: formData[form.baseFields.name.id] ?? '',
  email: formData[form.baseFields.email.id] ?? '',
  message: formData[form.baseFields.message.id] ?? '',
  fields: (selectedType?.fields ?? [])
    .map(field => ({ label: field.label, value: formData[field.id] ?? '' }))
    .filter(entry => entry.value.trim() !== ''),
  botField,
});
