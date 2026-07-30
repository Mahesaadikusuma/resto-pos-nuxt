import type { DropdownMenuItem, NavigationMenuItem } from "@nuxt/ui";

export const useNavigation = () => {
    const rawMenuData: NavigationMenuItem[][] = [
        [
            {
                label: "Personal",
                type: "label",
                slot: "personal-label" as const,
            },
            {
                label: "Dashboard",
                icon: "i-lucide-house",
                to: '/dashboard/admin',
            },
            {
                label: "Inbox",
                icon: "i-lucide-inbox",
                badge: "4",
            },
            {
                label: "Orders",
                icon: "i-lucide-package",
            },
        ],
        [
            {
                label: 'Management',
                type: 'label',
            },
            {
                label: 'Product',
                icon: 'i-lucide-package',
                to: '/dashboard/admin/management/product',
            },
            {
                label: 'Categories',
                icon: 'i-lucide-package',
                to: '/dashboard/admin/management/category',
                
            },
            {
                label: 'Customers',
                icon: 'i-lucide-users',
                to: '/dashboard/admin/customers',
            },
            {
                label: 'Orders',
                icon: 'i-lucide-package',
                to: '/dashboard/admin/orders',
            },
        ],
        [
            {
                label: "Settings",
                type: "label",
            },


            {
                label: "Settings",
                icon: "i-lucide-settings",
                defaultOpen: true,
                children: [
                    {
                        label: "User",
                        icon: "i-lucide-folder",
                        to: '/dashboard/admin/user',
                    },
                    {
                        label: "Roles",
                        icon: "i-lucide-folder",
                        to: '/dashboard/admin/role',
                    },
                ],
            },
        ],
    ];

    const getSidebarMenu = (state: 'collapsed' | 'expanded') => {
        return rawMenuData.map((group) => {
            return group
                // Sembunyikan judul 'label' saat sidebar mengecil
                .filter((item) => !(state === 'collapsed' && item.type === 'label'))

                // Atur buka-tutup children secara otomatis
                .map((item) => {
                    const processedItem = { ...item }
                    if (processedItem.children) {
                        processedItem.children = state === 'expanded' ? item.children : []
                    }
                    return processedItem
                })
        }) satisfies NavigationMenuItem[][]
    }


    const colorMode = useColorMode();
    const { data: authData, status, signOut } = useAuth();
    const userItems = computed<DropdownMenuItem[][]>(() => [
        [
            {
                label: 'Profile',
                icon: 'i-lucide-user'
            },

            {
                label: 'Settings',
                icon: 'i-lucide-settings',
                to: '/settings'
            }
        ],
        [
            {
                label: 'Appearance',
                icon: 'i-lucide-sun-moon',
                children: [
                    {
                        label: 'Light',
                        icon: 'i-lucide-sun',
                        type: 'checkbox',
                        checked: colorMode.value === 'light',
                        onUpdateChecked(checked: boolean) {
                            if (checked) {
                                colorMode.preference = 'light'
                            }
                        },
                        onSelect(e: Event) {
                            e.preventDefault()
                        }
                    },
                    {
                        label: 'Dark',
                        icon: 'i-lucide-moon',
                        type: 'checkbox',
                        checked: colorMode.value === 'dark',
                        onUpdateChecked(checked: boolean) {
                            if (checked) {
                                colorMode.preference = 'dark'
                            }
                        },
                        onSelect(e: Event) {
                            e.preventDefault()
                        }
                    }
                ]
            }
        ],
        ...(status.value === 'authenticated' ? [
            [
                {
                    label: 'Log Out',
                    icon: 'i-lucide-log-out',
                    onSelect() {
                        signOut({ callbackUrl: '/auth/login' })
                    }
                }
            ]
        ] : []),
    ])

    return {
        getSidebarMenu,
        userItems,
        authData
    };
};
