<script setup lang="ts">
  const client = useSupabaseClient();
  const user = useSupabaseUser();

  // Redirect to app dashboard if user is already authenticated
  watch(user, () => {
    if (user.value) {
      return navigateTo('/app/dashboard');
    }
  }, { immediate: true });

  const loginForm = reactive({
    email: '',
    password: '',
    rememberMe: true,
    loading: false,
    error: ''
  });

  async function signIn() {
    loginForm.loading = true;
    loginForm.error = '';
    
    try {
      const { error } = await client.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password
      });
      
      if (error) {
        loginForm.error = error.message;
      } else {
        // Redirect will happen via the watcher
      }
    } catch (err: any) {
      loginForm.error = err.message;
    } finally {
      loginForm.loading = false;
    }
  }

  const accountStore = useAccountStore();
  const notifyStore = useNotifyStore();

  const config = useRuntimeConfig();

  const handleGoogleSignin = async () => {
    console.log('handleGoogleSignin');
    try {
      loginForm.loading = true;
      const { error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${config.public.siteRootUrl}/confirm`
        }
      });
      if (error) throw error;
    } catch (error) {
      notifyStore.notify(error, NotificationType.Error);
    } finally {
      loginForm.loading = false;
    }
  };

  watchEffect(async () => {
    if (user.value) {
      await accountStore.init();
      navigateTo('/dashboard', { replace: true });
    }
  });
</script>
<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="w-full max-w-md p-6 space-y-6 bg-white rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-center">Sign in</h1>
      <form @submit.prevent="signIn" class="space-y-4">
        <div>
          <label for="email" class="block mb-2 font-bold">Email</label>
          <input
            v-model="loginForm.email"
            id="email"
            type="email"
            placeholder="Email"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label for="password" class="block mb-2 font-bold">Password</label>
          <input
            v-model="loginForm.password"
            id="password"
            type="password"
            placeholder="Password"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              v-model="loginForm.rememberMe"
              id="remember-me"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900"
              >Remember me</label
            >
          </div>
          <div class="text-sm">
            <NuxtLink
              to="/auth/forgotpassword"
              class="text-indigo-600 hover:text-indigo-500"
              >Forgot your password?</NuxtLink
            >
          </div>
        </div>
        <div v-if="loginForm.error" class="text-red-600 text-sm">{{ loginForm.error }}</div>
        <button
          :disabled="loginForm.loading || loginForm.password === ''"
          type="submit"
          class="w-full py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
          {{ loginForm.loading ? 'Signing in...' : 'Sign in' }}
        </button>
      </form>
      <div class="text-center">
        <p class="text-gray-600">or</p>
        <button
          class="mt-2 flex w-full items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          @click="handleGoogleSignin"
        >
          <span class="w-5 h-5 mr-2">
            <Icon name="mdi:google" class="w-full h-full" />
          </span>
          Sign in with Google
        </button>
      </div>
      <div class="text-center">
        <p class="text-gray-600">
          Don't have an account?
          <NuxtLink to="/auth/signup" class="text-indigo-600 hover:text-indigo-500"
            >Sign up</NuxtLink
          >
        </p>
      </div>
    </div>
  </div>
</template>
