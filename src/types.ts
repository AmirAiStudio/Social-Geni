export type ToneOfVoice = 'Bold' | 'Fun' | 'Professional' | 'Luxury' | 'Friendly';
export type BusinessCategory = 'E-commerce' | 'Personal Brand' | 'Service-Based Business' | 'Restaurant & Food' | 'Education' | 'Tech & Digital' | 'Entertainment & Activities' | 'Handmade Business';
export type Goal = 'Awareness' | 'Sales' | 'Engagement' | 'Lead Generation';
export type Duration = '7 Days' | '14 Days' | '30 Days';
export type Platform = 'Instagram' | 'Facebook' | 'TikTok' | 'LinkedIn' | 'YouTube';
export type InterfaceLanguage = 'Arabic' | 'English';
export type ContentLanguage = 'Arabic' | 'English';
export type ArabicDialect = 'Egyptian Colloquial' | 'Gulf Arabic' | 'Modern Standard Arabic';
export type EnglishTone = 'Casual' | 'Professional' | 'Marketing Tone';

export type AppState = {
  brandName: string;
  toneOfVoice: ToneOfVoice | '';
  businessCategory: BusinessCategory | '';
  subCategory: string[];
  serviceIndustry: string;
  goal: Goal | '';
  duration: Duration | '';
  platforms: Platform[];
  interfaceLanguage: InterfaceLanguage;
  contentLanguage: ContentLanguage;
  arabicDialect: ArabicDialect | '';
  englishTone: EnglishTone | '';
};

export const initialAppState: AppState = {
  brandName: '',
  toneOfVoice: '',
  businessCategory: '',
  subCategory: [],
  serviceIndustry: '',
  goal: '',
  duration: '',
  platforms: [],
  interfaceLanguage: 'English',
  contentLanguage: 'English',
  arabicDialect: '',
  englishTone: '',
};

export const BUSINESS_SUBCATEGORIES: Record<BusinessCategory, string[]> = {
  'E-commerce': ['Fashion', 'Electronics', 'Beauty', 'Home Goods', 'Food & Beverage', 'Digital Products'],
  'Personal Brand': ['Creator', 'Coach', 'Consultant', 'Artist', 'Influencer'],
  'Service-Based Business': ['Agency', 'Freelancer', 'Local Business'],
  'Restaurant & Food': ['Fine Dining', 'Fast Food', 'Cafe', 'Food Truck', 'Bakery'],
  'Education': ['Online Course', 'School', 'University', 'Tutor', 'EdTech'],
  'Tech & Digital': ['SaaS', 'Mobile Apps', 'AI Tools', 'Web3 / Blockchain', 'Hardware'],
  'Entertainment & Activities': ['Kids Area', 'Padel Courts', 'Football Field', 'Basketball Court', 'PlayStation Café', 'Gaming Lounge'],
  'Handmade Business': ['Handmade Accessories', 'Home Decor', 'Gifts', 'Personalized Gifts', 'Custom Products', 'Art & Crafts', 'Small Handmade Business'],
};

export const SERVICE_INDUSTRIES = ['Marketing', 'Real Estate', 'Health & Wellness', 'Consulting'];
