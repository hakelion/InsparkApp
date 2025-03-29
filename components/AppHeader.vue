<script setup lang="ts">
const user = useSupabaseUser();
const route = useRoute();

// Check if current route is in the app section
const isAppRoute = computed(() => {
  return route.path.startsWith('/app/');
});

// Check if the current route is in auth section
const isAuthRoute = computed(() => {
  return route.path.startsWith('/auth/');
});

// Determine which navigation to show
const showAppNav = computed(() => isAppRoute.value && user.value);
const showMarketingNav = computed(() => !isAppRoute.value || !user.value);
</script>

<template>
  <Notifications />
  
  <!-- App Navigation for logged-in users in app area -->
  <AppNavigation v-if="showAppNav" />
  
  <!-- Marketing Navigation for marketing pages or unauthenticated users -->
  <MarketingNavigation v-if="showMarketingNav && !isAuthRoute" />
  
  <!-- No navigation for auth pages -->
  <div v-if="isAuthRoute" class="container mt-4 mb-4">
    <NuxtLink to="/" class="d-block text-center">
      <img src="~/assets/images/supanuxt_logo_200.png" alt="InkSpark Logo" class="img-fluid" style="max-height: 60px;" />
    </NuxtLink>
  </div>
</template>
