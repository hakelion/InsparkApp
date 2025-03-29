<script setup lang="ts">
const user = useSupabaseUser();
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
      <NuxtLink to="/" class="navbar-brand">InkSpark</NuxtLink>
      
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#marketingNavbar" 
              aria-controls="marketingNavbar" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="marketingNavbar">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <NuxtLink to="/pricing" class="nav-link">Pricing</NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink to="/contact" class="nav-link">Contact</NuxtLink>
          </li>
        </ul>
        
        <ul class="navbar-nav">
          <li class="nav-item" v-if="!user">
            <NuxtLink to="/auth/signin" class="nav-link">Sign In</NuxtLink>
          </li>
          <li class="nav-item" v-if="!user">
            <NuxtLink to="/auth/signup" class="nav-link btn btn-primary text-white ms-2 px-3">Start for free</NuxtLink>
          </li>
          <li class="nav-item" v-if="user">
            <NuxtLink to="/app/dashboard" class="nav-link btn btn-success text-white px-3">Go to Dashboard</NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template> 