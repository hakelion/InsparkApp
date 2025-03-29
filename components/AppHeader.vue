<script setup lang="ts">
  const user = useSupabaseUser();
  const supabase = useSupabaseClient();
  
  async function handleLogout() {
    await supabase.auth.signOut();
    navigateTo('/');
  }
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
      <Notifications />
      
      <NuxtLink to="/" class="navbar-brand">InkSpark</NuxtLink>
      
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" 
              aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item" v-if="user">
            <NuxtLink to="/dashboard" class="nav-link">Dashboard</NuxtLink>
          </li>
          <li class="nav-item" v-if="user">
            <NuxtLink to="/Brainstorm/Brainstorm" class="nav-link">Brainstorming</NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink to="/pricing" class="nav-link">Pricing</NuxtLink>
          </li>
          <li class="nav-item" v-if="!user">
            <NuxtLink to="/signin" class="nav-link">Sign In</NuxtLink>
          </li>
          <li class="nav-item" v-if="!user">
            <NuxtLink to="/signup" class="nav-link">Start for free</NuxtLink>
          </li>
          <li class="nav-item" v-if="!user">
            <a href="https://github.com/JavascriptMick/supanuxt-saas" 
               class="nav-link" title="github">
              <Icon name="mdi:github" />
            </a>
          </li>
          <li class="nav-item" v-if="user">
            <a @click="handleLogout" class="nav-link text-danger" role="button">Logout</a>
          </li>
        </ul>
        
        <div v-if="user">
          <UserAccount :user="user" />
        </div>
      </div>
    </div>
  </nav>
</template>
