export interface ServicePayload {
  id?: string;
  budgetAmount?: number;
  titleEn?: string;
  titleAr: string;
  city?: string;
  image?: string;
  categoryId: string;
  description?: string;
  budgetCurrency?: "SYP" | "USD";
}
