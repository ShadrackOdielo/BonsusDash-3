<script setup lang="ts">




defineProps<{
    title: string
    icon: string
    value: string
}>();
</script>
<template>
    <UCard>
        <template #header>
            <h2 class="text-lg font-semibold">{{ title }}</h2>
        </template>
        <template #default>
            <div class="flex items center justify-between">
                <div class="flex items-center space-x-2">
                    <UIcon :name="icon" class="text-2xl" />
                    <span class="text-2xl font-semibold">{{ value }}</span>
                </div>
                <UIcon name="i-lucide-arrow-right" />
            </div>
        </template>
    </UCard>
    
</template>