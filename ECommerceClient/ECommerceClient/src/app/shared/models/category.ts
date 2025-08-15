import { Brand } from './brands';

export interface Category {
  id: string;
  name: string;
  slug?: string; // URL slug'ı için
  description?: string;
  isExpanded?: boolean;
  subCategories?: SubCategory[];
  brands?: Brand[];
  selectedBrands?: Brand[];
}

export interface SubCategory {
  id: string;
  name: string;
  slug?: string; // URL slug'ı için
  description?: string;
  isExpanded?: boolean;
  categoryId?: string;
  brands?: Brand[];
  selectedBrands?: Brand[];
}