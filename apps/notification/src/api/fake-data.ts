// Realistic fake data so the offline dashboard renders end-to-end.
// Every list and detail endpoint resolves to something the UI can paint.

const ORG_ID = '000000000000000000000001';
const USER_ID = '000000000000000000000002';
const DEV_ENV_ID = '000000000000000000000010';
const PROD_ENV_ID = '000000000000000000000011';

const now = () => new Date().toISOString();
const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString();
const minsAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

export const fakeOrg = {
  _id: ORG_ID,
  name: 'Metronome',
  createdAt: daysAgo(180),
  updatedAt: daysAgo(2),
  externalOrgId: ORG_ID,
  publicMetadata: { externalOrgId: ORG_ID },
};

export const fakeUser = {
  _id: USER_ID,
  firstName: 'Local',
  lastName: 'User',
  email: 'local@notification.dev',
  organizationId: ORG_ID,
};

function makeEnv(name: 'Development' | 'Production', id: string) {
  return {
    _id: id,
    name,
    _organizationId: ORG_ID,
    identifier: name.toLowerCase(),
    slug: name.toLowerCase(),
    color: name === 'Development' ? '#3b82f6' : '#22c55e',
    type: name === 'Development' ? 'dev' : 'prod',
    widget: { notificationCenterEncryption: false },
    apiKeys: [
      {
        key: `nv_${name.toLowerCase()}_${id.slice(-8)}`,
        _userId: USER_ID,
        hash: 'mock-hash',
      },
    ],
  };
}

export const fakeEnvironments = [
  makeEnv('Development', DEV_ENV_ID),
  makeEnv('Production', PROD_ENV_ID),
];

export const fakeApiKeys = [
  { key: `nv_dev_${DEV_ENV_ID.slice(-8)}`, _userId: USER_ID, hash: 'mock-hash' },
];

const workflowSeeds = [
  { name: 'Welcome Email', id: 'welcome-email', tags: ['onboarding'], steps: ['email'] },
  { name: 'Password Reset', id: 'password-reset', tags: ['auth'], steps: ['email'] },
  { name: 'Order Confirmation', id: 'order-confirmation', tags: ['commerce'], steps: ['email', 'sms'] },
  { name: 'Payment Failed', id: 'payment-failed', tags: ['billing'], steps: ['email', 'in_app'] },
  { name: 'Weekly Digest', id: 'weekly-digest', tags: ['marketing'], steps: ['email'] },
  { name: 'New Comment', id: 'new-comment', tags: ['social'], steps: ['in_app', 'push'] },
  { name: 'Account Verification', id: 'account-verification', tags: ['auth'], steps: ['email', 'sms'] },
  { name: 'Shipping Update', id: 'shipping-update', tags: ['commerce'], steps: ['sms', 'push'] },
];

function makeWorkflow(seed: (typeof workflowSeeds)[number], i: number) {
  const _id = `wf_${String(i).padStart(24, '0')}`;
  return {
    _id,
    workflowId: seed.id,
    name: seed.name,
    description: `Triggered when ${seed.name.toLowerCase()} event fires`,
    tags: seed.tags,
    active: true,
    validatePayload: false,
    isTranslationEnabled: false,
    slug: `${seed.id}_wf_${_id.slice(-8)}`,
    updatedAt: daysAgo(i),
    createdAt: daysAgo(30 + i * 5),
    lastTriggeredAt: minsAgo(i * 17 + 3),
    origin: 'novu-cloud',
    status: 'ACTIVE',
    stepTypeOverviews: seed.steps,
    steps: seed.steps.map((type, j) => ({
      _id: `${_id}_step_${j}`,
      stepId: `${seed.id}-${type}`,
      name: `${type.toUpperCase()} step`,
      slug: `${seed.id}-${type}_st_${j}`,
      type,
      origin: 'novu-cloud',
      controls: { values: {}, schema: { type: 'object', properties: {} } },
      controlValues: {},
      issues: {},
    })),
    issues: {},
    preferences: {
      user: null,
      default: {
        all: { enabled: true, readOnly: false },
        channels: {
          email: { enabled: true },
          sms: { enabled: true },
          in_app: { enabled: true },
          chat: { enabled: true },
          push: { enabled: true },
        },
      },
    },
  };
}

export const fakeWorkflows = workflowSeeds.map(makeWorkflow);

const layoutSeeds = [
  { name: 'Default Email', id: 'default-email' },
  { name: 'Marketing Email', id: 'marketing-email' },
  { name: 'Transactional Email', id: 'transactional-email' },
  { name: 'Plain Text', id: 'plain-text' },
];

function makeLayout(seed: (typeof layoutSeeds)[number], i: number) {
  const _id = `lay_${String(i).padStart(24, '0')}`;
  return {
    _id,
    layoutId: seed.id,
    name: seed.name,
    slug: `${seed.id}_lay_${_id.slice(-8)}`,
    description: `${seed.name} layout for the notification platform`,
    isDefault: i === 0,
    type: 'EMAIL',
    channel: 'email',
    origin: 'novu-cloud',
    updatedAt: daysAgo(i * 2),
    createdAt: daysAgo(60 + i * 7),
    controls: { values: {}, schema: { type: 'object', properties: {} } },
    controlValues: {},
    variables: { type: 'object', properties: {} },
    isTranslationEnabled: false,
    issues: {},
  };
}

export const fakeLayouts = layoutSeeds.map(makeLayout);

const integrationSeeds = [
  { name: 'SendGrid', provider: 'sendgrid', channel: 'email' },
  { name: 'Twilio SMS', provider: 'twilio', channel: 'sms' },
  { name: 'FCM Push', provider: 'fcm', channel: 'push' },
  { name: 'Novu In-App', provider: 'novu', channel: 'in_app' },
  { name: 'Slack', provider: 'slack', channel: 'chat' },
];

export const fakeIntegrations = integrationSeeds.map((s, i) => ({
  _id: `int_${String(i).padStart(24, '0')}`,
  _environmentId: DEV_ENV_ID,
  _organizationId: ORG_ID,
  name: s.name,
  identifier: `${s.provider}-${i}`,
  providerId: s.provider,
  channel: s.channel,
  credentials: {},
  active: true,
  deleted: false,
  primary: i === 0,
  conditions: [],
  createdAt: daysAgo(45 + i),
  updatedAt: daysAgo(i),
}));

const subscriberSeeds = [
  ['Ada', 'Lovelace', 'ada@example.com'],
  ['Alan', 'Turing', 'alan@example.com'],
  ['Grace', 'Hopper', 'grace@example.com'],
  ['Linus', 'Torvalds', 'linus@example.com'],
  ['Margaret', 'Hamilton', 'margaret@example.com'],
  ['Donald', 'Knuth', 'don@example.com'],
  ['Barbara', 'Liskov', 'barbara@example.com'],
  ['Tim', 'Berners-Lee', 'tim@example.com'],
  ['Edsger', 'Dijkstra', 'edsger@example.com'],
  ['Hedy', 'Lamarr', 'hedy@example.com'],
  ['Bjarne', 'Stroustrup', 'bjarne@example.com'],
  ['Brendan', 'Eich', 'brendan@example.com'],
  ['Guido', 'van Rossum', 'guido@example.com'],
  ['James', 'Gosling', 'james@example.com'],
  ['Anders', 'Hejlsberg', 'anders@example.com'],
];

export const fakeSubscribers = subscriberSeeds.map(([first, last, email], i) => ({
  _id: `sub_${String(i).padStart(24, '0')}`,
  _organizationId: ORG_ID,
  _environmentId: DEV_ENV_ID,
  subscriberId: `user_${(first ?? '').toLowerCase()}_${i}`,
  firstName: first,
  lastName: last,
  email,
  phone: `+1555${String(1_000_000 + i).padStart(7, '0')}`,
  avatar: null,
  locale: 'en-US',
  data: {},
  channels: [],
  isOnline: i % 3 === 0,
  lastOnlineAt: minsAgo(i * 7),
  createdAt: daysAgo(60 + i),
  updatedAt: daysAgo(i),
}));

const activityTemplates = [
  ['Welcome Email', 'welcome-email', 'completed'],
  ['Order Confirmation', 'order-confirmation', 'completed'],
  ['Password Reset', 'password-reset', 'completed'],
  ['Weekly Digest', 'weekly-digest', 'pending'],
  ['Shipping Update', 'shipping-update', 'completed'],
  ['Payment Failed', 'payment-failed', 'failed'],
  ['Account Verification', 'account-verification', 'completed'],
  ['New Comment', 'new-comment', 'completed'],
];

export const fakeActivity = Array.from({ length: 25 }, (_, i) => {
  const t = activityTemplates[i % activityTemplates.length] ?? activityTemplates[0]!;
  const sub = fakeSubscribers[i % fakeSubscribers.length]!;
  return {
    _id: `act_${String(i).padStart(24, '0')}`,
    _environmentId: DEV_ENV_ID,
    _organizationId: ORG_ID,
    _subscriberId: sub._id,
    subscriber: sub,
    _templateId: `wf_${String(i % fakeWorkflows.length).padStart(24, '0')}`,
    template: {
      _id: `wf_${String(i % fakeWorkflows.length).padStart(24, '0')}`,
      name: t[0],
      triggers: [{ identifier: t[1] }],
    },
    transactionId: `tx_${i}`,
    channels: ['email'],
    status: t[2],
    payload: {},
    createdAt: minsAgo(i * 11 + 1),
    updatedAt: minsAgo(i * 11),
    jobs: [],
  };
});

export const fakeTopics = [
  { key: 'product-updates', name: 'Product Updates', subscribers: 312 },
  { key: 'billing-alerts', name: 'Billing Alerts', subscribers: 89 },
  { key: 'beta-program', name: 'Beta Program', subscribers: 47 },
  { key: 'security-notices', name: 'Security Notices', subscribers: 412 },
].map((t, i) => ({
  _id: `top_${String(i).padStart(24, '0')}`,
  _environmentId: DEV_ENV_ID,
  _organizationId: ORG_ID,
  key: t.key,
  name: t.name,
  subscribersCount: t.subscribers,
  createdAt: daysAgo(30 + i * 7),
  updatedAt: daysAgo(i),
}));

export const fakeEnvVars = [
  {
    _id: 'envar_001',
    key: 'API_BASE_URL',
    value: 'https://api.example.com',
    isSecret: false,
    _environmentId: DEV_ENV_ID,
    createdAt: daysAgo(60),
    updatedAt: daysAgo(2),
  },
  {
    _id: 'envar_002',
    key: 'SENDGRID_API_KEY',
    value: '••••••••••••',
    isSecret: true,
    _environmentId: DEV_ENV_ID,
    createdAt: daysAgo(45),
    updatedAt: daysAgo(5),
  },
  {
    _id: 'envar_003',
    key: 'WEBHOOK_SECRET',
    value: '••••••••••••',
    isSecret: true,
    _environmentId: DEV_ENV_ID,
    createdAt: daysAgo(30),
    updatedAt: daysAgo(1),
  },
];

export const fakeAgents = [
  {
    _id: 'agent_001',
    name: 'Support Bot',
    emoji: '🤖',
    description: 'Handles support inquiries',
    active: true,
    integrationsCount: 2,
    createdAt: daysAgo(20),
    updatedAt: daysAgo(1),
  },
  {
    _id: 'agent_002',
    name: 'Sales Assistant',
    emoji: '💼',
    description: 'Qualifies inbound leads',
    active: true,
    integrationsCount: 1,
    createdAt: daysAgo(10),
    updatedAt: now(),
  },
];

export const fakeTags = ['onboarding', 'auth', 'commerce', 'billing', 'marketing', 'social'];

export const fakeChartData = {
  totalNotifications: 18_473,
  totalSubscribers: fakeSubscribers.length,
  byChannel: {
    email: 12_201,
    sms: 3_410,
    push: 1_904,
    in_app: 958,
  },
  series: Array.from({ length: 14 }, (_, i) => ({
    date: daysAgo(13 - i),
    count: 800 + Math.floor(Math.random() * 600),
  })),
};

export function pickWorkflow(slug: string) {
  return (
    fakeWorkflows.find(
      (w) => w.workflowId === slug || w._id === slug || w.slug === slug
    ) ?? fakeWorkflows[0]!
  );
}

export function pickLayout(slug: string) {
  return (
    fakeLayouts.find(
      (l) => l.layoutId === slug || l._id === slug || l.slug === slug
    ) ?? fakeLayouts[0]!
  );
}

export function pickSubscriber(id: string) {
  return (
    fakeSubscribers.find((s) => s.subscriberId === id || s._id === id) ??
    fakeSubscribers[0]!
  );
}

export function pickTopic(key: string) {
  return fakeTopics.find((t) => t.key === key || t._id === key) ?? fakeTopics[0]!;
}

export function pickActivity(id: string) {
  return fakeActivity.find((a) => a._id === id) ?? fakeActivity[0]!;
}

export function pickIntegration(id: string) {
  return fakeIntegrations.find((i) => i._id === id) ?? fakeIntegrations[0]!;
}

export function pickAgent(id: string) {
  return fakeAgents.find((a) => a._id === id) ?? fakeAgents[0]!;
}
