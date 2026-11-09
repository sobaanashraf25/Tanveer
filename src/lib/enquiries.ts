import { supabase } from '@/lib/supabase';

export interface EnquiryInput {
  name: string;
  phone: string;
  propertyType: string;
  message: string;
}

export async function submitEnquiry(input: EnquiryInput): Promise<void> {
  const { error } = await supabase.from('enquiries').insert({
    name: input.name.trim(),
    phone: input.phone.trim(),
    property_type: input.propertyType,
    message: input.message.trim(),
  });

  if (error) throw new Error(error.message);
}
