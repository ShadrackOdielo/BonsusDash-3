<script setup lang="ts">

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  long_description?: string;
  price: number;
  retail_price: number;
  size: string;
  stock_quantity?: number;
  category_name: string;
  brand?: string;
  style?: string;
  images?: string[];
  is_active?: boolean;
}

 defineProps<{ product: Product | null }>();

const modal = useModal();

</script>

<template>
  <UModal :title="product?.name" >
    <template #body>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <UCarousel v-if="product?.images?.length" :items="product.images" class="rounded-lg overflow-hidden">
            <template #default="{ item }">
              <img :src="item" class="w-full h-64 object-cover" alt="Product Image" >
            </template>
          </UCarousel>
        </div>
        <div class="space-y-4">
          <p class="text-gray-600">{{ product?.description }}</p>
          <p v-if="product?.long_description" class="text-gray-500 text-sm">{{ product.long_description }}</p>
          <div class="text-lg font-bold text-primary">${{ product?.price.toFixed(2) }}</div>
          <div class="text-sm text-gray-500">Retail Price: ${{ product?.retail_price.toFixed(2) }}</div>
          <div class="text-sm text-gray-500">Category: {{ product?.category_name }}</div>
          <div class="text-sm text-gray-500">Brand: {{ product?.brand || 'N/A' }}</div>
          <div class="text-sm text-gray-500">Size: {{ product?.size }}</div>
          <div class="text-sm text-gray-500">Stock: {{ product?.stock_quantity }}</div>
        </div>
      </div>
</template>
    <template #footer>
      <div class="flex justify-end space-x-4">
        <UButton @click="modal.close()">Close</UButton>
        <UButton @click="modal.close()">Edit</UButton>
      </div>
    </template>
  </UModal>
</template>
