import CredentialsProvider from 'next-auth/providers/credentials'
import { NuxtAuthHandler } from '#auth'
import { authService } from '~/services/auth.service'
import type { JWTExtended, SessionExtended, UserExtended } from '~/types/Auth'



export default NuxtAuthHandler({
    secret: useRuntimeConfig().NUXT_AUTH_SECRET,
    session: {
        strategy: "jwt",
        // maxAge: 60 * 60 * 24, // 1 hari
        // 60 detik * 60 menit * 24 jam * 7 hari
        maxAge: 60 * 60 * 24 * 7,
    },
    providers: [
        // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
        CredentialsProvider.default({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "text" },
                password: { label: "password", type: "password" },
            },
            async authorize(credentials: Record<"email" | "password", string> | undefined): Promise<UserExtended | null> {
                // const config = useRuntimeConfig()
                if (!credentials?.email || !credentials?.password) return null

                const payload = {
                    email: credentials.email,
                    password: credentials.password,
                }

                // const userTokens = await $fetch<LoginResponse | null>(`${config.LARAVEL_BASE_URL}/auth/login`, {
                //     method: 'POST',
                //     body: payload,
                //     headers: {
                //         'Content-Type': 'application/json',
                //         'Accept': 'application/json',
                //     },
                // })
                // console.log('LOGIN RESPONSE:', userTokens)
                const userTokens = await authService.login(payload)
                const accessToken = userTokens?.data?.token

                if (!accessToken) return null

                // const me = await $fetch<UserResponse>(`${config.LARAVEL_BASE_URL}/me`, {
                //     method: 'GET',
                //     headers: {
                //         'Authorization': `Bearer ${accessToken}`,
                //         'Content-Type': 'application/json',
                //         'Accept': 'application/json',
                //     },
                // })

                // console.log('ME RESPONSE:', me)
                const me = await authService.getProfile(accessToken)
                const user = me?.data

                if (!user) return null

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    roles: user.roles,
                    accessToken: accessToken,
                } as any            
            },
        })
    ],
    pages: {
        signIn: '/auth/login',
        signOut: '/auth/logout',
        // error: '/auth/login',
        // verifyRequest: '/auth/login',
    },
    callbacks: {
        async jwt({ token, user }: {token: JWTExtended; user: UserExtended | null}) {
            // if (user) {
            //     token.accessToken = (user as any).access_token
            //     token.roles = (user as any).roles
            // }
            // console.log('JWT TOKEN:', token)
            // return token
            if (user) {
                token.user = user;
            }
            return token;
        },
        async session({ session, token }:  {session: SessionExtended; token: JWTExtended}) {
            // if (session.user) {
            //     (session.user as any).accessToken = token.accessToken;
            //     (session.user as any).roles = token.roles;
            // }
            // console.log('SESSION:', session)
            // return session

            session.user = token.user;
            session.accessToken = token.user?.accessToken;
            return session
        },
    },
})