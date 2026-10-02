import { brands } from "@/data/brands";
import { categoryGroups } from "@/data/categories";
import { models } from "@/data/models";
import { products } from "@/data/products";
import type { Brand, CategoryGroup, MotorcycleModel, Product } from "@/lib/types";

/**
 * Data-access boundary. Pages and components never import seed files directly;
 * they go through the catalogue service, which reads from this repository.
 * To move to a database or API, implement this interface and change `repository` below.
 */
export interface CatalogRepository {
  listProducts(): Promise<Product[]>;
  listBrands(): Promise<Brand[]>;
  listModels(): Promise<MotorcycleModel[]>;
  listCategoryGroups(): Promise<CategoryGroup[]>;
}

export const staticRepository: CatalogRepository = {
  async listProducts() {
    return products;
  },
  async listBrands() {
    return brands;
  },
  async listModels() {
    return models;
  },
  async listCategoryGroups() {
    return categoryGroups;
  },
};

export const repository: CatalogRepository = staticRepository;
