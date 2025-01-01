
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import User from '@/models/adminUser'; // Assuming you’ve set up a User model with MongoDB
import { connectToDB } from '@/db';
export const authOptions = {
        providers: [
          CredentialsProvider({
            name: 'Credentials',
            credentials: {
              username: { label: "Username", type: "username" },
              email: { label: "Email", type: "email" },
              password: { label: "Password", type: "password" }
            },
            authorize: async (credentials) => {
              try {
                      await connectToDB();
                      const user = await User.findOne({username:credentials.username, email: credentials.email });
                      if(!user ){
                              throw new Error("Invalid credentials");
                      }

                      const isMatch = await bcrypt.compare(credentials.password, user.password);
                      if (!isMatch) {
                        throw new Error('Invalid credentials');
                      }
                      return user;
              } catch (error) {
                      throw new Error(error);
              }
      
            }
          })
        ],
        pages:{
              signIn:'/sign-in'
        },
        session: {
          strategy: "jwt",
        },
        callbacks: {
          async jwt({ token, user }) {
            if (user) {
              token.id = user._id;
              token.role = user.role;
              token.username = user.username;
              token.image = user.image;
            }
            return token;
          },
          async session({ session, token }) {
            session.user.id = token._id;
            session.user.role = token.role;
            session.user.username = token.username;
            session.user.image = token.image;
            return session;
          }
        },
        secret: process.env.NEXTAUTH_SECRET
      }