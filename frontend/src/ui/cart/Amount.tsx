import { formatCOP } from '@/utils/format-currency'

type AmountProps = {
    label: string
    amount: number
}

export default function Amount({ label, amount }: AmountProps) {
    return (
        <div className="flex justify-between">
            <dt className="font-medium">{label}</dt>
            <dd className="font-bold">{formatCOP(amount)}</dd>
        </div>
    )
}
