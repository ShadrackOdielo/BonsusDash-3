<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { Database } from '~/types/supabase'

const open = ref(false)
const selectedImage = ref<{ file: File, previewUrl: string }>()
const schema = z.object({
    name: z.string().nonempty(),
    slug: z.string().nonempty(),
    description: z.string().nonempty(),
    long_description: z.string(),
    image_url: z.string().nonempty(),
})

type Schema = z.output<typeof schema>
const supabase = useSupabaseClient<Database>()
const state = reactive<Partial<Schema>>({
    name: '',
    slug: '',
    description: '',
    long_description: '',
    image_url: '',
})
// rename image and upload to supabase 'images bucket and get the url
const HandleImage = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async () => {
        const { error } = await supabase.storage.from('images').upload(`${state.name}/${file.name}`, reader.result as ArrayBuffer)
        if (error) {
            console.error(error)
            return
        }
        //get public url of the image and asign it to state image url
        const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(`${state.name}/${file.name}`)
        if (!publicUrlData) return
        state.image_url = publicUrlData.publicUrl
    }
    reader.readAsArrayBuffer(file)
}

// Handle image selection & preview
function onImageSelect(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  selectedImage.value = {
    file,
    previewUrl: URL.createObjectURL(file)
  }
  
}
// slugify the name
watchEffect(() => {
    state.slug = state.name?.toLowerCase().replace(/[^a-z0-9]/g, '-')
})
const toast = useToast()
// submit the form to supabase categories table and clear the form
async function onSubmit(event: FormSubmitEvent<Schema>) {
    const { error } = await supabase.from('categories').insert([event.data])
    if (error) {
        console.error(error)
        return
    }
    
    toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
    open.value = false
    console.log(event.data)
  
}
</script>

<template>
    <UModal v-model:open="open" title="Create Category"> 
        <UButton label="Add Category" icon="i-lucide-plus"/>
    <template #body>
  <UForm :schema="schema"  :state="state" class="space-y-4" @submit="onSubmit">
    <UFormField label="Name" name="name">
      <UInput v-model="state.name" />
    </UFormField>

    <UFormField label="Slug" name="slug">
      <UInput v-model="state.slug" />
    </UFormField>

    <UFormField label="Description" name="description">
      <UInput v-model="state.description" />
    </UFormField>

    <UFormField label="Long Description" name="long_description">
      <UTextarea v-model="state.long_description" />
    </UFormField>

    <UFormField label="Image URL" name="image_url">
        <UAvatar v-if="selectedImage" :src="selectedImage?.previewUrl" size="2xl" class="rounded-none" />
      <UInput v-model="state.image_url" type="file" accept="image/*" @change="onImageSelect" />
      <UButton v-if="selectedImage" label="upload Image" @click="HandleImage" />
      <UAvatar v-if="state.image_url" label="upload preview" :src="state.image_url" />
    </UFormField>

    <UButton type="submit" loading-auto>
      Submit
    </UButton>
  </UForm>
</template>
</UModal> 
</template>

