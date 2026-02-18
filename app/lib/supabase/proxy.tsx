import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'


export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })
  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  const pathname = request.nextUrl.pathname;

  if (!user && (!pathname.startsWith('/auth') || (pathname.startsWith('/auth') && pathname.endsWith("signup"))) && pathname !== '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/auth';
    return NextResponse.redirect(url)
  }

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name, phone') 
      .eq('user_id', user.sub)
      .single();

    if (!profile?.first_name && !profile?.last_name && !profile?.phone) {
      if (pathname !== '/auth/signup') {
        const url = request.nextUrl.clone();
        url.pathname = '/auth/signup';
        return NextResponse.redirect(url)
      }
    } else {
      if (pathname.startsWith('/auth') || pathname == '/auth/signup' || pathname == '/') {
        const url = request.nextUrl.clone();
        url.pathname = '/volunteer';
        return NextResponse.redirect(url)
      }
    }
  }


  // // 1️⃣ Not logged in → redirect to /auth
  // if (
  //   !user &&
  //   !pathname.startsWith('/auth') &&
  //   pathname !== '/'
  // ) {
  //   console.log("running #1")
  //   const url = request.nextUrl.clone()
  //   url.pathname = '/auth'
  //   return NextResponse.redirect(url)
  // }


  // // 2️⃣ Logged in → fetch profile
  // let profile = null
  // if (user) {
  //   const { data, error } = await supabase
  //     .from('profiles')
  //     .select('first_name, last_name, phone')
  //     .eq('user_id', user.sub)
  //     .select('*')

  //   profile = data

  // }

  // console.log(`Profile ${profile}`)

  // console.log("got here #2")

  // // 3️⃣ Logged in, profile incomplete → redirect to /auth/signup
  // if (
  //   user &&
  //   (!profile?.first_name && !profile?.last_name && !profile?.phone_number) &&
  //   pathname !== '/auth/signup'
  // ) {
  //   console.log("running #2")
  //   const url = request.nextUrl.clone()
  //   url.pathname = '/auth/signup'
  //   return NextResponse.redirect(url)
  // }

  // console.log("got here #3")

  // // 4️⃣ Logged in, profile exists → prevent visiting /auth or /auth/signup
  // if (
  //   user &&
  //   profile &&
  //   pathname.startsWith('/auth')
  // ) {
  //   console.log("running #3")
  //   const url = request.nextUrl.clone()
  //   url.pathname = '/volunteer'
  //   return NextResponse.redirect(url)
  // }


  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}