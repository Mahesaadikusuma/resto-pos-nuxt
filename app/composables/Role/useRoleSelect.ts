export async function useRoleSelect() {
    const config = useRuntimeConfig()
    const searchRole = ref('')
    const searchRoleDebounced = refDebounced(searchRole, 500)
    const { accessToken } = await useAuthToken()

    const { data: roles, status: rolesStatus, execute } = await useLazyFetch(`${config.public.laravelBaseUrl}/role?limit=5`, {
        key: 'role-select',
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        transform: (response: IRoleResponse)=> {
            const roles = response?.data || []

            return roles.map((role: IRole) => ({
                label: role.name,
                // value: String(role.id),
                value: role.name,
            }))
        },
        immediate: false
    })

    function onOpen() {
        if (!roles.value?.length) {
            execute()
        }
    }

    return {
        searchRole,
        searchRoleDebounced,
        roles,
        rolesStatus,
        onOpen,
    }
}