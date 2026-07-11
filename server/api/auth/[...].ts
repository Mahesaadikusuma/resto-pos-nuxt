import { NuxtAuthHandler } from '#auth'
import CredentialsProvider from 'next-auth/providers/credentials'

interface LoginResponse {
    success: boolean
    message: string
    data: {
        user: {
            id: number
            name: string
            email: string
        }
        token: string
    }
}

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
        // @ts-expect-error Perlu .default agar berfungsi saat SSR
        CredentialsProvider.default({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any) {
                try {
                    const config = useRuntimeConfig()
                    if (!credentials?.email || !credentials?.password) return null

                    const payload = {
                        email: credentials.email,
                        password: credentials.password,
                    } 

                    const userTokens = await $fetch<LoginResponse | null>(`${config.LARAVEL_BASE_URL}/auth/login`, {
                        method: 'POST',
                        body: payload,
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                    })

                    const accessToken = userTokens?.data?.token

                    if (!accessToken) {
                        return null
                    }

                    const me = await $fetch<UserResponse>(`${config.LARAVEL_BASE_URL}/user`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                    })

                    const user = me?.data

                    if (!user) {
                        return null
                    }

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        roles: user.roles,
                        access_token: accessToken,
                    } as any
                } catch (error) {
                    console.warn('Error logging in', error)
                    return null
                }
            },
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = (user as any).access_token
                token.roles = (user as any).roles
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).accessToken = token.accessToken;
                (session.user as any).roles = token.roles;
            }
            return session
        },
    },
})