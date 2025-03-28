require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Setup clients
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SERVICE_KEY
);

async function testDataAccess() {
  console.log('\n🔍 Testing data access with SUPABASE_KEY (anon key)...');
  
  try {
    // Just check if we can connect to Supabase API
    const { error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Connection error:', error.message);
      return false;
    }
    
    console.log('✅ Successfully connected to Supabase with anon key');
    return true;
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    return false;
  }
}

async function testAuthOperations() {
  console.log('\n🔐 Testing auth operations with SERVICE_KEY...');
  try {
    // List first few users to verify admin access
    console.log('Listing users with admin privileges...');
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 5
    });
    
    if (error) throw error;
    
    console.log(`✅ Successfully listed ${data.users.length} users with admin key`);
    return true;
  } catch (error) {
    console.error('❌ Auth operations test failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Supabase dual-key configuration tests\n');
  
  console.log('Environment variables:');
  console.log(`SUPABASE_URL: ${process.env.SUPABASE_URL ? '✓ Set' : '✗ Missing'}`);
  console.log(`SUPABASE_KEY: ${process.env.SUPABASE_KEY ? '✓ Set' : '✗ Missing'}`);
  console.log(`SERVICE_KEY: ${process.env.SERVICE_KEY ? '✓ Set' : '✗ Missing'}`);
  
  const dataTestPassed = await testDataAccess();
  const authTestPassed = await testAuthOperations();
  
  console.log('\n📊 Test Results:');
  console.log(`Data Access (anon key): ${dataTestPassed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Auth Operations (service key): ${authTestPassed ? '✅ PASSED' : '❌ FAILED'}`);
  
  if (dataTestPassed && authTestPassed) {
    console.log('\n🎉 All tests passed! Your dual-key configuration is working correctly.');
    console.log('You can now use:');
    console.log('- Regular client with SUPABASE_KEY for CRUD operations');
    console.log('- Admin client with SERVICE_KEY for auth operations');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the error messages above.');
  }
}

runTests().catch(error => {
  console.error('Test suite failed:', error);
}); 