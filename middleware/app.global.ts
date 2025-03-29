export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser();
  
  // If route starts with /app/ and user is not authenticated
  if (to.path.startsWith('/app/') && !user.value) {
    return navigateTo('/auth/signin');
  }
}); 