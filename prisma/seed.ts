import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create default plans
  const freePlan = await prisma.plan.upsert({
    where: { name: 'Free' },
    update: {},
    create: {
      name: 'Free',
      features: ['BASIC_EDITOR', 'WORD_COUNT', 'SAVE_DRAFTS', 'NEXUS', 'BRAINSTORMING', 'AI_SUGGESTIONS'],
      max_credits_per_month: 0,
      max_credits_per_day: 500
    }
  });

  const standardPlan = await prisma.plan.upsert({
    where: { name: 'Standard' },
    update: {},
    create: {
      name: 'Standard',
      features: ['BASIC_EDITOR', 'WORD_COUNT', 'SAVE_DRAFTS', 'ADVANCED_FORMATTING', 'EXPORT_OPTIONS', 'NEXUS', 'BRAINSTORMING', 'AI_SUGGESTIONS'],
      max_credits_per_month: 70000,
      max_credits_per_day: 500,
      stripe_product_id: 'prod_RzrO7vFuzG7Igw'
    }
  });

  const professionalPlan = await prisma.plan.upsert({
    where: { name: 'Professional' },
    update: {},
    create: {
      name: 'Professional',
      features: [
        'BASIC_EDITOR',
        'WORD_COUNT',
        'SAVE_DRAFTS',
        'ADVANCED_FORMATTING',
        'EXPORT_OPTIONS',
        'NEXUS',
        'BRAINSTORMING',
        'AI_SUGGESTIONS',
        'PRIORITY_SUPPORT'
      ],
      max_credits_per_month: 500000,
      max_credits_per_day: 500,
      stripe_product_id: 'prod_S0itMQD4vYdlLO'
    }
  });

  // Create a demo account with the free plan
  const demoAccount = await prisma.account.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Demo Account',
      plan_id: freePlan.id,
      invite_code: 'DEMO2025'
    }
  });

  // Create a demo user
  const demoUser = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      supabase_uid: 'demo-user-id',
      email: 'demo@example.com',
      display_name: 'Demo User'
    }
  });

  // Create membership for demo user
  const demoMembership = await prisma.membership.upsert({
    where: { 
      user_id_account_id: {
        user_id: demoUser.id,
        account_id: demoAccount.id
      }
    },
    update: {},
    create: {
      user_id: demoUser.id,
      account_id: demoAccount.id,
      access: 'OWNER',
      pending: false
    }
  });

  // Create initial credit usage record for demo account
  const demoCredit = await prisma.creditUsage.create({
    data: {
      account_id: demoAccount.id,
      month: new Date().getMonth() + 1, // Current month (1-12)
      year: new Date().getFullYear(),
      day_usage: 0
    }
  });

  console.log({ freePlan, standardPlan, professionalPlan, demoAccount, demoUser, demoMembership, demoCredit });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });