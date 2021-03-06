import { FunctionComponent } from 'react'
import Link from 'next/link'

export const Footer: FunctionComponent = () => (
  <div className="text-center text-xs py-4 mb-4">
    <Link href="/changelog">
      <a className="block mb-2 underline">v3</a>
    </Link>
    <p>Created by Andrew Nguyen in 2020.</p>
  </div>
)
