import { CategoriesResponseSchemas, Product } from "@/schemas/schemas";
import ProductWizardModal from "./ProductWizardModal";

async function getCategories() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/categorias`;
  const req = await fetch(url, { cache: "no-store" });
  const json = await req.json();
  return CategoriesResponseSchemas.parse(json);
}

export default async function ProductWizardWrapper({ product }: { product?: Product }) {
  const categories = await getCategories();
  return <ProductWizardModal categories={categories} product={product} />;
}
