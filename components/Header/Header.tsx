import { FunctionComponent } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/router'

export const Header: FunctionComponent = () => {
  const router = useRouter()
  return (
    <div className="flex items-center bg-gray-700 text-white justify-between sha h-16 px-4">
      {router.asPath !== '/' ? (
        <Link href="/">
          <div className="p-4 -ml-4">
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </div>
        </Link>
      ) : (
        <div className="w-6"></div>
      )}
      <span className="text-4xl font-bold font-mono">ScoreCard</span>
      <div className="w-6"></div>
    </div>
  )
}
