import CredentialsProvider from 'next-auth/providers/credentials'
import { NuxtAuthHandler } from '#auth'
import { authService } from '~/services/auth.service'

interface Role {
    id: number
    name: string
    permissions: any[]
}

interface UserResponse {
    success: boolean
    message: string
    data: {
        id: number
        name: string
        email: string
        roles: Role[]
    }
}


export default NuxtAuthHandler({
    secret: useRuntimeConfig().NUXT_AUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24,
    },
    providers: [
        // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
        CredentialsProvider.default({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any) {
                try {
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
                } catch (error: any) {
                    // console.warn('Error logging in', error)
                    console.error('AUTHORIZE ERROR:', {
                        message: error?.message,
                        status: error?.response?.status ?? error?.statusCode,
                        data: error?.response?._data ?? error?.data,
                    })

                    return null
                }
            },
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
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
        async session({ session, token }) {
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