import { formatCOP } from '@/utils/format-currency'

type AmountProps = {
    label: string
    amount: number
    discount?: boolean
}

export default function Amount({ label, amount, discount }: AmountProps) {
    return (
        <div
            className={`${discount && 'bg-green-400 text-green-800 flex flex-row '} flex flex-row mt-2 justify-between p-1`}
        >
            <dt className="font-bold">{label}</dt>
            <dd className="font-bold">
                {discount && '-'}
                {formatCOP(amount)}
            </dd>
        </div>
    )
}
