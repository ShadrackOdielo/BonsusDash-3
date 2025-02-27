<template>
  <UApp>
  <div class="w-full h-screen overflow-x-hidden bg-(--ui-bg)" vaul-drawer-wrapper>
    <div class="flex h-full w-full">
      <div class="flex flex-row w-full">
        <Sidebar /> 
        <div :key="route.fullPath" class="p-6 overflow-y-auto w-full " >
          <Navbar />
          <NuxtPage class="min-h-screen" />
          <AppFooter />
        </div>
      </div>
    </div>
  </div>
</UApp>
</template>

<script setup>
import Sidebar from '~/components/layout/Sidebar.vue';
import Navbar from '~/components/layout/Navbar.vue';
import AppFooter from '~/components/layout/AppFooter.vue';


const route = useRoute();
console.log('Rendering NuxtPage for:', route.fullPath);
</script>