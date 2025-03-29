<script setup lang="ts">
  const supabase = useSupabaseClient();
  const accountStore = useAccountStore();

  onMounted(async () => {
    await accountStore.init();
  });

  async function signout() {
    await supabase.auth.signOut();
    if (accountStore) {
      accountStore.signout();
    }
    navigateTo('/', { replace: true });
  }
</script>
<template>
  <a href="#" @click.prevent="signout()" class="dropdown-item">Signout</a>
</template>
