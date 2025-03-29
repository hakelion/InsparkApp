<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const accountStore = useAccountStore();
  const { dbUser, activeAccountId } = storeToRefs(accountStore);

  onMounted(async () => {
    await accountStore.init();
  });
</script>

<template>
  <template v-if="dbUser?.memberships && dbUser?.memberships.length > 1">
    <li><div class="dropdown-header">Switch Account</div></li>
    <li v-for="membership in dbUser?.memberships">
      <a
        v-if="membership.account_id !== activeAccountId && !membership.pending"
        href="#"
        @click="accountStore.changeActiveAccount(membership.account_id)"
        class="dropdown-item">
        {{ membership.account.name }}
      </a>
      <span v-if="membership.pending" class="dropdown-item-text text-muted">
        {{ membership.account.name }} (pending)
      </span>
    </li>
  </template>
</template>
