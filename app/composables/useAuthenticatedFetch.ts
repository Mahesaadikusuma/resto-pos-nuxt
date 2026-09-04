// composables/useAuthenticatedFetch.ts
export async function useAuthToken() {
  const { getSession, signOut } = useAuth()
  const session = await getSession()
  const accessToken = (session?.user as { accessToken?: string })?.accessToken

  if (!accessToken) {
    await navigateTo('/auth/login')
  }

  return { accessToken, signOut }
}