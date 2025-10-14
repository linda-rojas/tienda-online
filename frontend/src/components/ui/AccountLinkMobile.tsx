import { FaUser } from 'react-icons/fa'
import { montserrat } from '../../ui/fonts'
import Link from 'next/link'

export default function AccountLinkMobile() {
  return (
    <Link href={'/admin/login'} className="flex max-w-fit items-center gap-2 cursor-pointer md:hidden lg:hidden">
      <span className={`${montserrat.className} text-blue-400 text-center`}>
        Mi cuenta
      </span>
      <FaUser className="h-5 w-5 text-blue-400" />
    </Link>
  )
}
