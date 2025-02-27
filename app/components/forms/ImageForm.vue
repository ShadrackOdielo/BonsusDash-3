<script setup lang="ts">
import { shallowRef, useTemplateRef, reactive, onMounted } from 'vue'
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type  { Database } from '~/types/supabase'
import { useDropZone} from '@vueuse/core'

const imageFilesData = shallowRef<{ name: string, size: number, type: string, lastModified: number }[]>([])

function onImageDrop(files: File[] | null) {
  imageFilesData.value = []
  if (files) {
    imageFilesData.value = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    }))
  }
}
const imageDropZoneRef = useTemplateRef<HTMLElement>('imageDropZoneRef')
const { isOverDropZone: isOverImageDropZone } = useDropZone(imageDropZoneRef, { dataTypes: ['image/png'], onDrop: onImageDrop })

const supabase = useSupabaseClient<Database>()
const schema = z.object({
    product_id: z.string().nonempty(),
    original_name: z.string().nonempty(),
    image_url: z.string().nonempty(),
    alt_text: z.string().nonempty(),
    caption: z.string(),
    isPrimary: z.boolean(),
})
type Schema = z.output<typeof schema>
const state = reactive<Partial<Schema>>({
    product_id: '',
    original_name: '',
    image_url: '',
    alt_text: '',
    caption: '',
    isPrimary: false,
})
async function onSubmit(event: FormSubmitEvent<Schema>) {
    console.log(event.data)
}
// get product id as prop from the parent component and pass it to the form
const props = defineProps({
    productId: {
        type: String,
        required: true
    }
})
// rename image and upload to supabase 'images bucket and get the url
const HandleImage = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async () => {
        const { data, error } = await supabase.storage.from('images').upload(`${state.product_id}/${file.name}`, reader.result as ArrayBuffer)
        if (error) {
            console.error(error)
            return
        }
        state.image_url = data?.fullPath
    }
    reader.readAsArrayBuffer(file)
}

onMounted(() => {
    state.product_id = props.productId
})
</script>
<template>
<UForm  :schema="schema" :state="state" @submit="onSubmit">
    <UFormField label="Product ID" name="product_id">
        <UInput v-model="state.product_id" />
    </UFormField>
    <UFormField label="Original Name" name="original_name">
        <UInput v-model="state.original_name" />
    </UFormField>
    <UFormField label="Image URL" name="image_url">
        <div ref="dropzone" class="border-2 border-dashed border-gray-300 p-4 rounded-lg cursor-pointer">
            <UInput type="file" @change="HandleImage" class="hidden" />
            <p class="text-center">Drop an image here or click to upload</p>
        </div>
        <div
        ref="imageDropZoneRef"
        class="flex flex-col w-full min-h-200px h-auto bg-gray-400/10 justify-center items-center mt-6 rounded"
      >
        <div font-bold mb2>
          Image DropZone
        </div>
        <div>
          isOverDropZone:
          <BooleanDisplay :value="isOverImageDropZone" />
        </div>
        <div class="flex flex-wrap justify-center items-center">
          <div v-for="(file, index) in imageFilesData" :key="index" class="w-200px bg-black-200/10 ma-2 pa-6">
            <p>Name: {{ file.name }}</p>
            <p>Size: {{ file.size }}</p>
            <p>Type: {{ file.type }}</p>
            <p>Last modified: {{ file.lastModified }}</p>
          </div>
        </div>
        </div>
        <UInput v-model="state.image_url" />
    </UFormField>
    <UFormField label="Alt Text" name="alt_text">
        <UInput v-model="state.alt_text" />
    </UFormField>
    <UFormField label="Caption" name="caption">
        <UInput v-model="state.caption" />
    </UFormField>
    <UFormField label="Is Primary" name="isPrimary">
        <UCheckbox v-model="state.isPrimary" />
    </UFormField>
</UForm>
</template>