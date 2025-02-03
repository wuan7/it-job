import { MessageCircleMore } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const MessageButton = () => {
  return (
    <div>
        <Link href="/conversations">
        <div className="relative rounded-full  w-10 h-10 flex justify-center items-center bg-white ">
          <MessageCircleMore className="text-primaryBlue size-5" />
          {true && (
            <div className="absolute -top-1 -right-1.5 flex justify-center items-center text-xs p-1 w-5 h-5 bg-red-500 text-white rounded-full">
              3
            </div>
          )}
        </div>
        
        </Link>
    </div>
  )
}

export default MessageButton