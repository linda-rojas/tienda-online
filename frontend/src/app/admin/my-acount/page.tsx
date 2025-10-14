import MyAccount from "@/components/ui/admin/MyAccount/MyAccount";
import { Category } from "@/schemas/schemas";
import { Nav } from "@/components/ui/mainNav/Nav";

interface HeaderProps {
  categories: Category[]
}

export default function My_Account({ categories }: HeaderProps) {

  return (
    <div className="flex flex-col gap-20">
      <Nav categories={categories} />
      <div className="bg-gray-200 shadow w-full mx-auto p-3 sm:p-10 lg:p-8 lg:w-3/5 items-center mt-26">
        <MyAccount />
      </div>
    </div>
  );
}
