// this file is used to modified the existing types
// to add new properties or methods

import 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface User {
    _id?: string
    isVerified?: boolean
    isAcceptingMessages?: boolean
    uname?: string
  }
  interface Session {
    user: {
      _id?: string
      isVerified?: boolean
      isAcceptingMessages?: boolean
      uname?: string
    } & DefaultSession['user']
  }
}
