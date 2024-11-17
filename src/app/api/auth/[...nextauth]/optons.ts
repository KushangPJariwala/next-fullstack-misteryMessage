import dbConnect from '@/lib/dbConnect'
import UserModel from '@/model/User'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect()
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.indentifier },
              { uname: credentials.indentifier },
            ],
          })
          if (!user) {
            throw new Error('no user found with this email')
          }
          if (!user.isVerified) {
            throw new Error('Please verify your account')
          }
          const isPswdMatch = await bcrypt.compare(
            credentials.password,
            user.password,
          )
          if (isPswdMatch) {
            return user
          } else {
            throw new Error('Incorrect password')
          }
        } catch (err) {
          throw new Error((err as Error).message || 'An error occurred in auth')
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token._id = user._id?.toString()
        token.isVerified = user.isVerified
        token.isAcceptingMessages = user.isAcceptingMessages
        token.uname = user.uname
      }
      return token
    },

    async session({
      session,
      user,
      token,
    }: {
      session: any
      user: any
      token: any
    }) {
      if (token) {
        session.user = {
          ...session.user, // Ensures default user fields are retained
          _id: token._id,
          isVerified: token.isVerified,
          isAcceptingMessages: token.isAcceptingMessages,
          uname: token.uname,
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/sign-in',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
