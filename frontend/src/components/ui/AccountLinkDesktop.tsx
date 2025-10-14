import { FaUser } from 'react-icons/fa'
import { montserrat } from '../../ui/fonts'
import Link from 'next/link'

export default function AccountLinkDesktop() {
  return (
    <Link href={'/admin/login'} className="hidden items-center gap-2 cursor-pointer md:flex md:gap-1 lg:flex">
      <span className={`${montserrat.className} text-white text-center md:hidden lg:flex`}>
        Mi cuenta
      </span>
      <FaUser className="h-5 w-5 text-white" />
    </Link>
  )
}
