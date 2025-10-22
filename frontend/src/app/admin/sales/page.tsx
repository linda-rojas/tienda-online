import { getSalesByDate } from "@/api";
import AdminNav from "@/components/ui/admin/panelAdmin/AdminNav";
import Heading from "@/components/ui/admin/panelAdmin/Heading";
import TransactionFilter from "@/components/ui/admin/panelAdmin/transaction/TransactionFilter";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

export default async function SalesPage() {
  const queryClient = new QueryClient
  const today = new Date()
  const formattedDate = format(today, 'yyyy-MM-dd')
  console.log(formattedDate)

  await queryClient.prefetchQuery({
    queryKey: ['sales', formattedDate],
    queryFn: () => getSalesByDate(formattedDate)
  })

  return (
    <section className="bg-gray-100">
      <AdminNav />
      <div className="lg:min-h-screen container mx-auto mt-10 px-10 lg:px-0">
        <div className="bg-gray-50 shadow w-full mx-auto p-10 my-10 lg:w-3/5">
          <Heading>Ventas</Heading>
          <p className="text-lg">calendario: </p>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <TransactionFilter />
          </HydrationBoundary>
        </div>
      </div>
    </section>
  );
}
