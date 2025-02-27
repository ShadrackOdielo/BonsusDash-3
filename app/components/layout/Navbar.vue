<script setup>
const colorMode = useColorMode()
const user = useSupabaseUser()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})


const items = [
    {
        slot:"message",

    },
    
    {
        slot: "toggle",
    },
    {
        label: "Notifications",
        icon: "i-lucide-bell",
        
        slot: "notifications",
        children: [
            {
                label: "Messages",
                slot: "messages",
                icon: "i-lucide-mail"
            },
            {
                label: "Alerts",
                slot: "alerts",
                icon: "i-lucide-bell"
            }
        ]
    },
    {
        label:"Account",
        icon: "i-lucide-user-round",
        slot: "account",
        children: !user ? [
            {
            label: "Profile",
            to: "/profile",
            icon: "i-lucide-user"
            },
            {
            label: "Settings",
            to: "/settings",
            icon: "i-lucide-settings"
            },
            {
            label: "Logout",
            to: "/logout",
            icon: "i-lucide-log-out"
            }
        ] : [
            {
            label: "Sign In",
            to: "/login",
            icon: "i-lucide-log-in"
            },
            {
            label: "Register",
            to: "/register",
            icon: "i-lucide-user-plus"
            }
        ]
    }
]
</script>
<template>
    <div class="flex items-center justify-between shadow-2xl w-full sticky top-0 z-50 ">
        <LayoutMobileSidebar  />
    
   <UNavigationMenu  :items="items" orientation="horizontal" content-orientation="vertical" class="w-full flex justify-end " >
         
         <template #account>
            <!-- show user avatar when logged in and generic icon -->
            <UAvatar v-if="user" src="/avatar.jpg" size="sm" />
            <UButton v-else icon="i-lucide-user" label="Sign In" variant="subtle" />
         </template>
         <template #toggle>
            <ClientOnly>
            <USwitch :model-value="isDark" checked-icon="i-lucide-moon" unchecked-icon="i-lucide-sun" @change="isDark = !isDark" />
        </ClientOnly>    
        </template>
         <template #notifications="{item}">
            <UChip text="3" >
                <UButton variant="ghost" :icon="item.icon" />
            </UChip>
            </template>
            
    </UNavigationMenu>
    </div>
</template>