'use client'
import { useState } from "react";
import 'react-calendar/dist/Calendar.css'
import Calendar from "react-calendar";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getSalesByDate } from "@/api";
import TransactionSummary from "./TransactionSummary";
import { formatCOP } from "@/utils/format-currency";

type ValuePiece = Date | null
type Value = ValuePiece | [ValuePiece, ValuePiece]

export default function TransactionFilter() {

    const [date, setDate] = useState<Value>(new Date())

    const formattedDate = format(date?.toString() || new Date(), 'yyyy-MM-dd')
    // console.log(formattedDate)
    const { data, isLoading } = useQuery({
        queryKey: ['sales', formattedDate],
        queryFn: () => getSalesByDate(formattedDate)
    })

    const total = data?.reduce((total, transaction) => total + +transaction.total, 0) ?? 0

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-15 mt-10 relative items-start">
            <div className="lg:sticky lg:top-10">
                <Calendar
                    value={date}
                    onChange={setDate}
                    locale="es"
                />
            </div>
            <div>
                {isLoading && 'Cargando ...'}
                {
                    data ? data.length ? data.map(transaction => (
                        <TransactionSummary
                            key={transaction.id}
                            transaction={transaction}
                        />
                    )) : <p className="text-lg text-center">No hay ventas en esta fecha</p> : null
                }
                <span className='my-5 text-lg font-bold text-right'>
                    Total del día: {''}
                    <p className='font-normal'>{formatCOP(total)}</p>
                </span>
            </div>
        </div>
    );
}
