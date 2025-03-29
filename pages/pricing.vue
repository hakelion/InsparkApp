<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { ACCOUNT_ACCESS } from '~~/prisma/account-access-enum';

  const accountStore = useAccountStore();
  const { activeMembership } = storeToRefs(accountStore);

  // Function to safely check plan name without causing TypeScript errors
  function isPlanName(membership: any, planName: string): boolean {
    if (!membership || !membership.account) return false;
    // Check plan_id instead of plan.name
    // For Free Plan, plan_id is usually 1
    // For Standard, plan_id is 2
    // For Professional, plan_id is 3
    if (planName === 'Standard' && membership.account.plan_id === 2) return true;
    if (planName === 'professional' && membership.account.plan_id === 3) return true;
    return false;
  }

  onMounted(async () => {
    await accountStore.init();
  });
</script>
<template>
  <div class="container py-5">
    <div class="text-center mb-5">
      <h2 class="display-4 fw-bold mb-4">Flexible Pricing</h2>
      <p class="lead text-muted">
        SupaNuxt SaaS is completely free and open source but you can price your
        own SaaS like this
      </p>
    </div>

    <div class="row">
      <!-- Free Plan -->
      <div class="col-md-4 mb-4">
        <div class="card h-100 shadow">
          <div class="card-body text-center p-5">
            <h3 class="card-title fw-bold mb-4">Free Plan</h3>
            <p class="card-text text-muted mb-4">Single user, 10 notes</p>
            <p class="fs-1 fw-bold mb-4">
              $0<span class="fs-6 text-muted">/mo</span>
            </p>
            <button
              v-if="!activeMembership"
              @click.prevent="navigateTo('/signup')"
              class="btn btn-primary btn-lg">
              Start for free
            </button>
          </div>
        </div>
      </div>

      <!-- Personal Plan -->
      <div class="col-md-4 mb-4">
        <div class="card h-100 shadow">
          <div class="card-body text-center p-5">
            <h3 class="card-title fw-bold mb-4">Standard Plan</h3>
            <p class="card-text text-muted mb-4">Single user, 100 notes</p>
            <p class="fs-1 fw-bold mb-4">
              $4,99<span class="fs-6 text-muted">/mo</span>
            </p>

            <!-- logged in user gets a subscribe button-->
            <form
              action="/create-checkout-session"
              method="POST"
              v-if="
                activeMembership &&
                (activeMembership.access === ACCOUNT_ACCESS.OWNER ||
                  activeMembership.access !== ACCOUNT_ACCESS.ADMIN) &&
                !isPlanName(activeMembership, 'Standard')
              ">
              <input
                type="hidden"
                name="price_id"
                value="price_1R5rg9Ruv9CTAvejaDBbbZI0" />
              <input
                type="hidden"
                name="account_id"
                :value="activeMembership?.account_id" />
              <button
                type="submit"
                class="btn btn-primary btn-lg">
                Subscribe
              </button>
            </form>
            <!-- anon user gets a link to sign up -->
            <button
              v-if="!activeMembership"
              @click.prevent="navigateTo('/signup')"
              class="btn btn-primary btn-lg">
              Get started
            </button>
          </div>
        </div>
      </div>

      <!-- Team Plan -->
      <div class="col-md-4 mb-4">
        <div class="card h-100 shadow">
          <div class="card-body text-center p-5">
            <h3 class="card-title fw-bold mb-4">Professional Plan</h3>
            <p class="card-text text-muted mb-4">10 users, 200 notes</p>
            <p class="fs-1 fw-bold mb-4">
              $19,99<span class="fs-6 text-muted">/mo</span>
            </p>

            <!-- logged in user gets a subscribe button-->
            <form
              action="/create-checkout-session"
              method="POST"
              v-if="
                activeMembership &&
                (activeMembership.access === ACCOUNT_ACCESS.OWNER ||
                  activeMembership.access !== ACCOUNT_ACCESS.ADMIN) &&
                !isPlanName(activeMembership, 'professional')
              ">
              <input
                type="hidden"
                name="price_id"
                value="price_1R6hS3Ruv9CTAvejq6fXT9Nz" />
              <input
                type="hidden"
                name="account_id"
                :value="activeMembership?.account_id" />
              <button
                type="submit"
                class="btn btn-primary btn-lg">
                Subscribe
              </button>
            </form>
            <!-- anon user gets a link to sign up -->
            <button
              v-if="!activeMembership"
              @click.prevent="navigateTo('/signup')"
              class="btn btn-primary btn-lg">
              Get started
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
