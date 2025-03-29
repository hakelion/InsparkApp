<script setup lang="ts">
  const client = useSupabaseClient();
  const user = useSupabaseUser();
  
  watch(user, () => {
    if (user.value) {
      return navigateTo('/app/dashboard');
    }
  }, { immediate: true });
  
  const email = ref('');
  const loading = ref(false);
  const resetSent = ref(false);
  const errorMessage = ref('');
  
  async function sendResetEmail() {
    loading.value = true;
    errorMessage.value = '';
    
    try {
      const { error } = await client.auth.resetPasswordForEmail(email.value, {
        redirectTo: `${window.location.origin}/auth/resetpassword`,
      });
      
      if (error) {
        errorMessage.value = error.message;
      } else {
        resetSent.value = true;
      }
    } catch (err: any) {
      errorMessage.value = err.message;
    } finally {
      loading.value = false;
    }
  }
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="w-full max-w-md p-6 space-y-6 bg-white rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-center">Reset Password</h1>
      
      <div v-if="!resetSent">
        <p class="mb-4 text-center text-gray-600">
          Enter your email address below and we'll send you a link to reset your password.
        </p>
        
        <form @submit.prevent="sendResetEmail" class="space-y-4">
          <div>
            <label for="email" class="block mb-2 font-bold">Email</label>
            <input
              v-model="email"
              id="email"
              type="email"
              placeholder="Your email address"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          
          <div v-if="errorMessage" class="text-red-600 text-sm">{{ errorMessage }}</div>
          
          <button
            type="submit"
            :disabled="loading || !email"
            class="w-full py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
            {{ loading ? 'Sending...' : 'Send Reset Link' }}
          </button>
        </form>
      </div>
      
      <div v-else class="text-center">
        <div class="flex justify-center mb-4">
          <Icon name="mdi:email-check" class="w-16 h-16 text-green-500" />
        </div>
        <h2 class="text-2xl font-bold mb-2">Check your email</h2>
        <p class="text-gray-600 mb-4">
          We've sent a password reset link to <strong>{{ email }}</strong>
        </p>
        <p class="text-gray-500 text-sm">
          If you don't see it, check your spam folder or
          <button 
            @click="resetSent = false"
            class="text-indigo-600 hover:text-indigo-500">
            try again
          </button>
        </p>
      </div>
      
      <div class="text-center mt-4">
        <NuxtLink to="/auth/signin" class="text-indigo-600 hover:text-indigo-500">
          Return to login
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
