<script setup lang="ts">
import type { TableColumn, DropdownMenuItem } from '@nuxt/ui'
import { LazyElementsProductModal } from '#components'

interface Product {
  id: number
  name: string
  slug: string
  description: string
  long_description: string
  images:  string 
  price: number
  stock_quantity: number
  category_name: string
}
const supabase = useSupabaseClient()
const modal = useModal()
const toast = useToast()
function open(product: Product) {

  modal.open(LazyElementsProductModal, {
    description: product.description,
    product: product,
    onSuccess() {
      toast.add({
        title: 'Success !',
        id: 'modal-success'
      })
    }
  })
}


const columns: TableColumn<Product>[] = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'description',
    header: 'Description'
  },
  {
    accessorKey: 'long_description',
    header: 'Long Description'
  },
  {
    accessorKey: 'price',
    header: 'Price'
  },
  {
    accessorKey: 'stock_quantity',
    header: 'Stock'
  },
  {
    accessorKey: 'category_name',
    header: 'Category'
  },
  {
    id: 'action'
  }
]

function getDropdownActions(product :Product): DropdownMenuItem[][] {
  return [
    [
      {
        label: 'Copy product Id',
        icon: 'i-lucide-copy',
        onSelect: () => {
          navigator.clipboard.writeText(product.id.toString())
          toast.add({
            title: 'User ID copied to clipboard!',
            color: 'success',
            icon: 'i-lucide-circle-check'
          })
        }
      }
    ],
    [
      {
        label: 'Edit',
        icon: 'i-lucide-edit'
      },
      {
        label: 'Delete',
        icon: 'i-lucide-trash',
        color: 'error'
      }
    ]
  ]
}

// fetch products from Supabase products table
const { data, status } = await useAsyncData<Product[]>('products', async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    

  if (error) throw error
  return data || []
})
</script>

<template>
  <div class="flex px-4 py-3.5 border-b border-(--ui-border-accented)">
    <UButton label="Add Product" icon="i-lucide-plus" to="/products/add" /> 
    </div>
  <UTable :sticky="true" :data="data" :columns="columns" class="flex-1" :loading="status === 'pending'">
    <template #name-cell="{ row }">
      <div class="flex items-center gap-3" @click="open(row.original)" >
        <UTooltip text="View product details" >
        <UAvatar src="/placeholder.webp" size="lg" />
      </UTooltip>
        <div>
          <p class="font-medium text-(--ui-text-highlighted)">
            {{ row.original.name.charAt(0).toUpperCase() + row.original.name.slice(1) }} Ksh {{ row.original.price }}
          </p>
          <p>
            {{ row.original.category_name }}. 
          </p>
        </div>
      </div>
      
    </template>
    <template #action-cell="{ row }">
      <UDropdownMenu :items="getDropdownActions(row.original)">
        <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" />
      </UDropdownMenu>
    </template>
    <template #id-cell="{ row }">
      <!-- sequence integers -->
      {{ row.index + 1 }}
    </template>
  </UTable>
</template>
