import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req){
        const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req, secret });
        const url = req.nextUrl.pathname;
        const isPublicPath = url.startsWith('/sign-in')||url.startsWith('/sign-up')||url.startsWith('/verify');
        if(isPublicPath && token){
                return NextResponse.redirect(new URL('/dashboard',req.url))
        }
        if(!isPublicPath && !token){
                return NextResponse.redirect(new URL('/sign-in',req.url))
        }
}
export const config = {
  matcher: ['/sign-in','/sign-up','/','/dashboard/:path*','/verify/:path'],
};
