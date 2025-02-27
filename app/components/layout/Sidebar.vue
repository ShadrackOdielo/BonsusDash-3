<template>
 <div class="hidden md:flex">
      <UNavigationMenu :ui="{linkLeadingIcon:'lg:size-6',linkLeadingAvatarSize:'sm',linkLeadingAvatar:'rounded-sm'}"  class=" data-[collapsed=false]:w-64 flex-1" :items="menuItems" orientation="vertical"  :collapsed="isOpen">
        <template #toggle>
        <UButton :icon="isOpen ? 'i-lucide-arrow-right': 'i-lucide-arrow-left' " variant="outline"  @click="toggleSidebar" />
          </template> 
      </UNavigationMenu>
  </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const isOpen = ref(true)
  const toggleSidebar = () => {
    isOpen.value = !isOpen.value
  }
  
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
  
  <style scoped>
  aside {
    transition: width 0.3s;
  }
  </style>
  