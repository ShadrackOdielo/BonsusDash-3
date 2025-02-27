<script setup>
const supabase = useSupabaseClient()

onMounted(() => {
    supabase.auth.signOut()
    router.push('/')
})
</script>
<template>
    <div>
        <h1>Logout</h1>
        <div class="flex justify-center items-center h-96">
            <div class="text-3xl">Logging out...</div>

        </div>
    </div>
</template>