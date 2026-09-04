import { LazyViewUsersHakAkses } from "#components"
import type { IUser } from "~/types/Auth"

export const useEditHakAkses = () => {
    const toast = useToast()
    const overlay = useOverlay()
    const modal = overlay.create(LazyViewUsersHakAkses)

    async function handleEdit(user: IUser) {
        const instance = modal.open({
            user: user,
        })

        const isConfirmed = await instance.result
        if (!isConfirmed) return

        await refreshNuxtData('users')

        toast.add({
            title: 'Berhasil',
            description: `Hak akses ${user.name} berhasil diupdate.`,
            color: 'success'
        })
    }

    return {
        handleEdit
    }
}