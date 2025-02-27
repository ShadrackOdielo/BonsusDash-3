<script setup lang="ts">
const isOpen = ref(false)
  const menuItems =ref([[
    {
      slot: 'toggle',

    },
    {
      label: 'Admin',
      slot: 'admin',
      avatar: {
        src:'/logo.jpg',
        alt: 'Admin',
        
      }
    },
  ],[
    { label: 'Dashboard', to: '/',icon: 'i-lucide-house' },
    { label: 'Products', to: '/products', icon: 'i-lucide-box',children:
      [
        { label: 'All Products',icon:"i-lucide-boxes", to: '/products' },
        { label: 'Add Product', icon: "i-lucide-grid-2x2-plus", to: '/products/add' },
        { label: 'Categories',icon: "i-lucide-grid-2x2", to: '/products/categories' },
      ]
    },
    { label: 'Customers', to: '/customers', icon: 'i-lucide-users', children:[
      {label:"All Customers",icon:"i-lucide-users",to:"/customers"},
      {label:"Add Customer", icon:"i-lucide-user-plus" ,to: "/customers/add"}
    ] },
    { label: 'Orders', to: '/orders', icon: 'i-lucide-shopping-cart' },
    { label: 'Reports', to: '/reports', icon: 'i-lucide-chart-pie' }],[
    { label: 'Settings', to: '/settings', icon: 'i-lucide-settings' },
    { label: 'Logout', to: '/logout', icon: 'i-lucide-log-out' },
  ]])
  </script>
  
 
<template>
  <UDrawer
    v-model:open="isOpen"
    should-scale-background
    :overlay="false"
    :ui="{ header: 'flex items-center justify-between' }"
  >
    <UButton icon="i-lucide-menu" color="neutral" variant="subtle"  />

    <template #header>
      <h2 class="text-(--ui-text-highlighted) font-semibold">Menu Drawer</h2>

      <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="isOpen = false" />
    </template>

    <template #body>
        <UNavigationMenu :ui="{linkLeadingIcon:'lg:size-6',linkLeadingAvatarSize:'sm',linkLeadingAvatar:'rounded-sm'}"  class="w-full" :items="menuItems" orientation="vertical" />
        </template>
  </UDrawer>
</template>
