import LoginForm from '@/components/ui/admin/LoginForm';
import { Category } from '@/schemas/schemas';
import { Nav } from '@/components/ui/mainNav/Nav';
import { ToastContainer } from 'react-toastify';

export default function Login({ pageProps, categories }: { pageProps: any; categories: Category[] }) {
  return (
    <div className="flex flex-col gap-20">
      <Nav categories={categories} />
      <div className="bg-gray-50 shadow w-full mx-auto p-0 lg:w-3/6 items-center mt-28">
        <LoginForm {...pageProps} />
      </div>
      <ToastContainer />
    </div>
  );
}
