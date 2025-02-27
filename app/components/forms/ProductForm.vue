<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { Database } from '~/types/supabase'
import { useSupabaseClient } from '#imports'

// Define product schema
const productSchema = z.object({
  name: z.string().nonempty('Name is required'),
  slug: z.string().nonempty('Slug is required'),
  description: z.string().nonempty('Description is required'),
  long_description: z.string().optional(),
  price: z.number().nonnegative('Price must be a positive number'),
  retail_price: z.number().nonnegative('Retail price must be a positive number'),
  stock_quantity: z.number().nonnegative('Stock must be a positive number'),
  category_name: z.string().nonempty('Category is required'),
  is_active: z.boolean(),
  brand: z.string().optional(),
  size: z.string(),
  images: z.array(z.string())
})

type ProductSchema = z.infer<typeof productSchema>

// Form state
const state = reactive<ProductSchema>({
  name: '',
  slug: '',
  description: '',
  long_description: '',
  price: 0,
  retail_price: 0,
  stock_quantity: 0,
  category_name: '',
  is_active: true,
  brand: '',
  size: 'sm',
  images: []
})

const categories = ref<string[]>([])
const toast = useToast()
const supabase = useSupabaseClient<Database>()

// generate slug from name
watch(() => state.name, (newName) => {
  state.slug = newName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}, { immediate: true })

// Image management
const selectedImages = ref<{ file: File, previewUrl: string }[]>([])
const uploadedImages = ref<{ url: string, name: string }[]>([])

// Prevent uploads if name or category are missing
const canUpload = computed(() => state.name && state.category_name)

// Handle image selection & preview
function onImageSelect(event: Event) {
  const files = (event.target as HTMLInputElement).files
  if (!files) return

  selectedImages.value = Array.from(files).map(file => ({
    file,
    previewUrl: URL.createObjectURL(file)
  }))
}

// Upload images to Supabase
async function uploadImages() {
  if (!canUpload.value) {
    toast.add({ title: 'Error', description: 'Name and Category are required before uploading images.', color: 'error' })
    return
  }

  const uploaded = await Promise.all(
    selectedImages.value.map(async ({ file }) => {
      const filePath = `${state.category_name}/${Date.now()}-${file.name}`
      const {  error } = await supabase.storage.from('images').upload(filePath, file)

      if (error) {
        console.error('Upload error:', error)
        toast.add({ title: 'Upload Failed', description: error.message, color: 'error' })
        return null
      }

      // Get public URL for the uploaded image
      const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(filePath)

      return { 
        url: publicUrlData.publicUrl, 
        name: filePath 
      }
    })
  )

  // Filter out any failed uploads
  uploadedImages.value = uploaded.filter(Boolean) as { url: string, name: string }[]
  state.images = uploadedImages.value.map(img => img.url)

  toast.add({ title: 'Success', description: 'Images uploaded successfully.', color: 'success' })
}

// Delete image from state & Supabase
async function removeImage(index: number) {
  const image = uploadedImages.value[index]
  if (!image) return

  const { error } = await supabase.storage.from('images').remove([image.name])
  if (error) {
    console.error('Delete error:', error)
    toast.add({ title: 'Delete Failed', description: error.message, color: 'error' })
    return
  }

  uploadedImages.value.splice(index, 1)
  state.images.splice(index, 1)
  toast.add({ title: 'Deleted', description: 'Image removed successfully.', color: 'info' })
}

// Handle form submission
async function onSubmit(event: FormSubmitEvent<ProductSchema>) {
  try {
    const { error } = await supabase.from('products').insert((event.data as ProductSchema))
    if (error) throw error

    toast.add({ title: 'Success', description: 'Product created successfully.', color: 'success' })
    onReset()
  } catch (error) {
    console.error('Error submitting product:', error)
    toast.add({ title: 'Error', description: error as string || "failed to do it", color: 'error' })
  }
}

// Reset form
function onReset() {
  Object.assign(state, {
    name: '',
    slug: '',
    description: '',
    long_description: '',
    price: 0,
    stock_quantity: 0,
    category_name: '',
    is_active: true,
    brand: '',
    size: 'S',
    images: []
  })
  selectedImages.value = []
  uploadedImages.value = []
  toast.add({ title: 'Reset', description: 'The form has been reset.', color: 'info' })
}

// Fetch categories on mount
onMounted(async () => {
  const { data, error } = await supabase.from('categories').select('name')
  if (error) {
    console.error('Error fetching categories:', error.message)
    return
  }
  categories.value = data.map(category => category.name)
})
</script>

<template>
 

    <UForm :schema="productSchema" :state="state" class="p-6" @submit="onSubmit" @reset="onReset">
      <UCard class="flex flex-col space-y-4">
        <template #header>
          <h1>Product Form</h1>
        </template>
      <UCard>
        <template #header>
          <h2>Product Details</h2>
        </template>
      <UFormField label="Name" name="name">
        <UInput v-model="state.name" />
      </UFormField>
      <UFormField label="Slug" name="slug">
        <UInput v-model="state.slug" />
      </UFormField>

      <UFormField label="Category" name="category_name">
        <USelect v-model="state.category_name" placeholder="select a category" :items="categories" />
      </UFormField>
      <UFormField label="Description" name="description">
        <UInput v-model="state.description" />
      </UFormField>
  
      <UFormField label="Long Description" name="long_description">
        <UTextarea v-model="state.long_description" />
      </UFormField>
      <UFormField label="Brand" name="brand">
        <UInput v-model="state.brand" />
      </UFormField>
    </UCard>
  <UCard >
    <template #header>
      <h2>Price </h2>
    </template>
      <UFormField label="Price" name="price">
        <UInputNumber v-model="state.price" />
      </UFormField>
  
      <UFormField label="Stock" name="stock">
        <UInputNumber v-model="state.stock_quantity" />
      </UFormField>
  
      <UFormField label="Retail Price" name="retail_price">
        <UInputNumber v-model="state.retail_price" />
      </UFormField>
  
      <UFormField label="Is Active" name="is_active">
        <UCheckbox v-model="state.is_active" />
      </UFormField>
    </UCard>
<UCard>
  <template #header>
    <h2>Images</h2>
  </template>
      <UFormField label="Image" name="image">
        <UInput type="file" multiple @change="onImageSelect" />
      </UFormField>
      <!-- Image Previews -->
      <div v-if="selectedImages.length > 0" class="grid grid-cols-3 gap-4 mt-4">
        <div v-for="(img, index) in selectedImages" :key="index" class="relative group">
          <NuxtImg :src="img.previewUrl" class="w-full h-24 object-cover rounded-md" />
          <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <UButton color="error" size="xs" @click="selectedImages.splice(index, 1)">Remove</UButton>
          </div>
        </div>
      </div>

      <UButton type="button" :disabled="!canUpload" color="primary" loading-auto @click="uploadImages">
        Upload Images
      </UButton>

      <!-- Uploaded Images -->
      <div v-if="uploadedImages.length > 0" class="grid grid-cols-3 gap-4 mt-4">
        <div v-for="(img, index) in uploadedImages" :key="index" class="relative group">
          <img :src="img.url" class="w-full h-24 object-cover rounded-md" >
          <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <UButton color="error" size="xs" @click="removeImage(index)">Delete</UButton>
          </div>
        </div>
      </div>
    </UCard>
    <template #footer>
      <div class="flex justify-between">
      <UButton type="submit" color="success" loading-auto>Submit</UButton>
      <UButton type="reset" color="warning" loading-auto>Reset</UButton>
    </div>
    </template>
    </UCard>
    </UForm>
  
</template>
<style lang="postcss" scoped>

  .ucard {
    padding: 0;
  }
</style>
