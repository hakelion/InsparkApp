<script setup lang="ts">
  const user = useSupabaseUser();
  const router = useRouter();
  
  const accountStore = useAccountStore();
  const notifyStore = useNotifyStore();
  
  watch(user, () => {
    if (user.value) {
      return navigateTo('/app/dashboard');
    }
  }, { immediate: true });
  
  const signupForm = reactive({
    email: '',
    name: '',
    password: '',
    loading: false,
    error: ''
  });
  
  const client = useSupabaseClient();
  
  async function signUp() {
    signupForm.loading = true;
    signupForm.error = '';
    
    try {
      const { error } = await client.auth.signUp({
        email: signupForm.email,
        password: signupForm.password,
        options: {
          data: {
            name: signupForm.name
          }
        }
      });
      
      if (error) {
        signupForm.error = error.message;
      } else {
        // Redirect will happen through the watcher if signup is auto-confirmed
        // Otherwise, we should show a confirmation screen
        router.push('/auth/confirm');
      }
    } catch (err: any) {
      signupForm.error = err.message;
    } finally {
      signupForm.loading = false;
    }
  }
  
  const handleGoogleSignup = async () => {
    try {
      signupForm.loading = true;
      const { error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/confirm`,
        },
      });
      if (error) throw error;
    } catch (error) {
      notifyStore.notify(error, NotificationType.Error);
    } finally {
      signupForm.loading = false;
    }
  };
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="w-full max-w-md p-6 space-y-6 bg-white rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-center">Sign up</h1>
      <form @submit.prevent="signUp" class="space-y-4">
        <div>
          <label for="name" class="block mb-2 font-bold">Name</label>
          <input
            v-model="signupForm.name"
            id="name"
            type="text"
            placeholder="Your name"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label for="email" class="block mb-2 font-bold">Email</label>
          <input
            v-model="signupForm.email"
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
            v-model="signupForm.password"
            id="password"
            type="password"
            placeholder="Password"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div v-if="signupForm.error" class="text-red-600 text-sm">{{ signupForm.error }}</div>
        <button
          :disabled="signupForm.loading || !signupForm.password"
          type="submit"
          class="w-full py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
          {{ signupForm.loading ? 'Signing up...' : 'Sign up' }}
        </button>
      </form>
      <div class="text-center">
        <p class="text-gray-600">or</p>
        <button
          @click="handleGoogleSignup"
          class="mt-2 flex w-full items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          <span class="w-5 h-5 mr-2">
            <Icon name="mdi:google" class="w-full h-full" />
          </span>
          Sign up with Google
        </button>
      </div>
      <div class="text-center">
        <p class="text-gray-600">
          Already have an account?
          <NuxtLink to="/auth/signin" class="text-indigo-600 hover:text-indigo-500"
            >Sign in</NuxtLink
          >
        </p>
      </div>
    </div>
  </div>
</template>
