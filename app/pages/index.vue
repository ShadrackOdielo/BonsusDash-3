<script setup>
import DashboardCard from '~/components/Elements/DashboardCard.vue';
</script>
<template>
<UCard>
  <template #header>
      <h2 class="text-lg font-semibold">Dashboard</h2>
  </template>
  <template #default>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <DashboardCard title="Products" value="10" icon="i-lucide-box" color="bg-blue-500" />
          <DashboardCard title="Categories" value="5" icon="i-lucide-boxes" color="bg-green-500" />
          <DashboardCard title="Users" value="20" icon="i-lucide-users" color="bg-yellow-500" />
          <DashboardCard title="Orders" value="15" icon="i-lucide-shopping-cart" color="bg-red-500" />
      </div>
  </template>
</UCard>
</template>