<script setup lang="ts">
const user = useSupabaseUser();
const supabase = useSupabaseClient();

async function handleLogout() {
  await supabase.auth.signOut();
  navigateTo('/');
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <NuxtLink to="/app/dashboard" class="navbar-brand">InkSpark App</NuxtLink>
      
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#appNavbar" 
              aria-controls="appNavbar" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="appNavbar">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <NuxtLink to="/app/dashboard" class="nav-link">Dashboard</NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink to="/app/brainstorm" class="nav-link">Brainstorming</NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink to="/app/account" class="nav-link">Account</NuxtLink>
          </li>
        </ul>
        
        <div class="d-flex align-items-center">
          <UserAccount v-if="user" :user="user" />
          <button @click="handleLogout" class="btn btn-outline-danger ms-3">Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template> 