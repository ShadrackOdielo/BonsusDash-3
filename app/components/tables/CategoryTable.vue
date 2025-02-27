<script setup lang="ts">
import { useSupabaseClient } from '#imports'
import type { TableColumn } from '@nuxt/ui'

const supabase = useSupabaseClient()

const UAvatar = resolveComponent('UAvatar')

type Category = {
  id: number
  name: string
  description: string
  long_description:string
  image_url: string
}

// Fetch products from Supabase
const { data, status } = await useAsyncData<Category[]>('categories', async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, description, long_description, image_url')

  if (error) throw error
  return data || []
})

// Define table columns
const columns: TableColumn<Category>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    // a cell with serial number
    cell: ({ row }) => row.index + 1
    
  },
  {
    accessorKey: 'name',
    header: 'Category',
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-3' }, [
        h(UAvatar, {
          src: row.original.image_url || '/placeholder.webp',
          size: 'lg'
        }),
        h('div', undefined, [
          h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.name),
          h('p', { class: 'text-sm text-(--ui-text-muted)' }, `Category: ${row.original.description}`)
        ])
      ])
    }
  },
  {
    accessorKey: 'long_description',
    header: 'Long Description',
    cell: ({ row }) => row.original.long_description
  },
  
]
</script>

<template>
  <div class="flex flex-col flex-1 w-full">
    <div class="flex px-4 py-3.5 border-b border-(--ui-border-accented)">
<FormsCategoryForm/>    </div>
    <UTable :data="data" :columns="columns" :loading="status === 'pending'" class="flex-1" />
  </div>
</template>
