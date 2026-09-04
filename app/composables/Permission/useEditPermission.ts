import { LazyViewPermissionEdit } from "#components"


export const useEditPermission = () => {
    const toast = useToast()
    const overlay = useOverlay()
    const modal = overlay.create(LazyViewPermissionEdit)

    async function handleEdit(permission: IPermission) {
        const instance = modal.open({
            permission: permission,
        })

        const isConfirmed = await instance.result
        if (!isConfirmed) return

        await refreshNuxtData('permissions')

        toast.add({
            title: 'Berhasil',
            description: `Hak akses ${permission.name} berhasil diupdate.`,
            color: 'success'
        })
    }

    return {
        handleEdit
    }
}