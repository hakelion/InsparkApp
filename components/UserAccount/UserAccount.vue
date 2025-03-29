<script setup lang="ts">
  const props = defineProps({
    user: {
      type: Object,
      required: true
    }
  });
  const { user } = props;
</script>

<template>
  <div class="dropdown">
    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
      <img
        v-if="user.user_metadata?.avatar_url"
        :src="user.user_metadata.avatar_url"
        alt="avatar image"
        class="rounded-circle"
        width="32"
        height="32" />
      <img
        v-else
        src="~/assets/images/avatar.svg"
        alt="default avatar image"
        class="rounded-circle"
        width="32"
        height="32" />
    </a>
    <ul class="dropdown-menu dropdown-menu-end">
      <li v-if="user"><span class="dropdown-item-text">{{ user.email }}</span></li>
      <li><hr class="dropdown-divider"></li>
      <li><NuxtLink to="/account" class="dropdown-item">Account</NuxtLink></li>
      <li><UserAccountSignout /></li>
      <UserAccountSwitch />
    </ul>
  </div>
</template>
