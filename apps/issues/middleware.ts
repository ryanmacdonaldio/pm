import { DefaultJWT, getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

type Token = DefaultJWT & {
  settings: { organization?: string };
};

export default withAuth(
  async (req) => {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.redirect(new URL('/api/auth/signin', req.url));
    }

    if (
      !req.nextUrl.pathname.startsWith('/organizations/add') &&
      !(token as Token).settings.organization
    ) {
      return NextResponse.redirect(new URL('/organizations/add', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized() {
        // Force above function to always run

        return true;
      },
    },
  }
);
