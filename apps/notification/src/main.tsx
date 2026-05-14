import '@novu/maily-core/style.css';
import { PermissionsEnum } from '@novu/shared';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';
import './index.css';
import { bootstrapOidc, OidcInitializationGate, OidcInitializationErrorGate } from '@/auth-client';

// Surface any uncaught runtime error to the DOM so we don't get silent white screens.
function showFatalError(label: string, err: unknown) {
  const root = document.getElementById('root');
  if (!root) return;
  const msg = err instanceof Error ? `${err.message}\n\n${err.stack ?? ''}` : String(err);
  root.innerHTML = `
    <div style="font-family: system-ui, sans-serif; padding: 24px; max-width: 900px; margin: 0 auto;">
      <h2 style="color:#b91c1c; margin-top:0;">${label}</h2>
      <pre style="background:#fafafa; padding:12px; border:1px solid #eee; border-radius:6px; white-space:pre-wrap; word-break:break-word;">${msg.replace(/</g, '&lt;')}</pre>
    </div>`;
}
window.addEventListener('error', (e) => showFatalError('Uncaught error', e.error ?? e.message));
window.addEventListener('unhandledrejection', (e) => showFatalError('Unhandled promise rejection', e.reason));

try {
  bootstrapOidc({
    implementation: 'real',
    issuerUri:
      import.meta.env.VITE_OIDC_ISSUER_URI ?? 'http://localhost:8080/realms/tiko',
    clientId: import.meta.env.VITE_OIDC_CLIENT_ID ?? 'notification-spa',
  });
} catch (err) {
  showFatalError('bootstrapOidc threw synchronously', err);
}

import { ConfigureWorkflow } from '@/components/workflow-editor/configure-workflow';
import { EditStepConditions } from '@/components/workflow-editor/steps/conditions/edit-step-conditions';
import { ConfigureStep } from '@/components/workflow-editor/steps/configure-step';

import {
  ActivityFeed,
  AnalyticsPage,
  ApiKeysPage,
  CreateLayoutPage,
  CreateWorkflowPage,
  ErrorPage,
  IntegrationsListPage,
  LayoutsPage,
  SettingsPage,
  TemplateModal,
  TranslationsPage,
  WelcomePage,
  WorkflowsPage,
} from '@/pages';
import {
  DispatchApiKeysPage,
  DispatchConversationsPage,
  DispatchDashboardPage,
  DispatchSettingsPage,
} from '@/pages/dispatch';
import { DuplicateWorkflowPage } from '@/pages/duplicate-workflow';
import { EditStepTemplateV2Page } from '@/pages/edit-step-template-v2';
import { SubscribersPage } from '@/pages/subscribers';
import { TranslationSettingsPage } from '@/pages/translation-settings-page';
import { WebhooksPage } from '@/pages/webhooks-page';
import { CreateIntegrationSidebar } from './components/integrations/components/create-integration-sidebar';
import { UpdateIntegrationSidebar } from './components/integrations/components/update-integration-sidebar';
import { ChannelPreferences } from './components/workflow-editor/channel-preferences';
import { IS_ENTERPRISE, IS_SELF_HOSTED } from './config';
import { FeatureFlagsProvider } from './context/feature-flags-provider';
import { AgentDetailsPage } from './pages/agent-details';
import { AgentsPage } from './pages/agents';
import { AgentsSetupPage } from './pages/agents-setup-page';
import { AgentsUsecasePage } from './pages/agents-usecase-page';
import { ContextsPage } from './pages/contexts';
import { CreateContextPage } from './pages/create-context';
import { CreateSubscriberPage } from './pages/create-subscriber';
import { CreateTopicPage } from './pages/create-topic';
import { DomainDetailPage } from './pages/domain-detail';
import { DomainsPage } from './pages/domains';
import { DuplicateLayoutPage } from './pages/duplicate-layout-page';
import { EditContextPage } from './pages/edit-context';
import { EditLayoutPage } from './pages/edit-layout';
import { EditSubscriberPage } from './pages/edit-subscriber-page';
import { EditTopicPage } from './pages/edit-topic';
import { EditTranslationPage } from './pages/edit-translation';
import { EditWorkflowPage } from './pages/edit-workflow';
import { EnvironmentsPage } from './pages/environments';
import { InboxEmbedPage } from './pages/inbox-embed-page';
import { InboxEmbedSuccessPage } from './pages/inbox-embed-success-page';
import { InboxUsecasePage } from './pages/inbox-usecase-page';
import { RedirectToLegacyStudioAuth } from './pages/redirect-to-legacy-studio-auth';
import { TestWorkflowDrawerPage } from './pages/test-workflow-drawer-page';
import { TestWorkflowRouteHandler } from './pages/test-workflow-route-handler';
import { TopicsPage } from './pages/topics';
import { UpsertVariablePage } from './pages/upsert-variable';
import { UsecaseSelectPage } from './pages/usecase-select-page';
import { VariablesPage } from './pages/variables';
import { VercelIntegrationPage } from './pages/vercel-integration-page';
import { CatchAllRoute, DashboardRoute, RootRoute } from './routes';
import { DispatchProtectedRoute } from './routes/dispatch-protected-route';
import { OnboardingParentRoute } from './routes/onboarding';
import { ProtectedRoute } from './routes/protected-route';
import { ROUTES } from './utils/routes';
import { initializeSentry } from './utils/sentry';
import { overrideZodErrorMap } from './utils/validation';

initializeSentry();
overrideZodErrorMap();

const router = createBrowserRouter([
  {
    element: <RootRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/onboarding',
        element: <OnboardingParentRoute />,
        children: [
          {
            path: ROUTES.USECASE_SELECT,
            element: <UsecaseSelectPage />,
          },
          {
            path: ROUTES.AGENTS_USECASE,
            element: <AgentsUsecasePage />,
          },
          {
            path: ROUTES.AGENTS_SETUP,
            element: <AgentsSetupPage />,
          },
          {
            path: ROUTES.INBOX_USECASE,
            element: <InboxUsecasePage />,
          },
          {
            path: ROUTES.INBOX_EMBED,
            element: <InboxEmbedPage />,
          },
          {
            path: ROUTES.INBOX_EMBED_SUCCESS,
            element: <InboxEmbedSuccessPage />,
          },
        ],
      },
      {
        path: ROUTES.ROOT,
        element: <DashboardRoute />,
        children: [
          /* Direct routes matching environment-specific paths (e.g., /topics -> /env/:envId/topics) 
             will be automatically redirected by the CatchAllRoute component */
          {
            index: true,
            element: <CatchAllRoute />,
          },
          {
            path: ROUTES.ENV,
            children: [
              {
                path: ROUTES.WELCOME,
                element: <WelcomePage />,
              },
              {
                path: ROUTES.WORKFLOWS,
                element: (
                  <ProtectedRoute permission={PermissionsEnum.WORKFLOW_READ}>
                    <WorkflowsPage />
                  </ProtectedRoute>
                ),
                children: [
                  {
                    path: ROUTES.TEMPLATE_STORE,
                    element: <TemplateModal />,
                  },
                  {
                    path: ROUTES.TEMPLATE_STORE_CREATE_WORKFLOW,
                    element: (
                      <ProtectedRoute permission={PermissionsEnum.WORKFLOW_WRITE} isDrawerRoute>
                        <TemplateModal />
                      </ProtectedRoute>
                    ),
                  },
                  {
                    path: ROUTES.WORKFLOWS_CREATE,
                    element: (
                      <ProtectedRoute permission={PermissionsEnum.WORKFLOW_WRITE} isDrawerRoute>
                        <CreateWorkflowPage />
                      </ProtectedRoute>
                    ),
                  },
                  {
                    path: ROUTES.WORKFLOWS_DUPLICATE,
                    element: (
                      <ProtectedRoute permission={PermissionsEnum.WORKFLOW_WRITE} isDrawerRoute>
                        <DuplicateWorkflowPage />
                      </ProtectedRoute>
                    ),
                  },
                ],
              },
              {
                path: ROUTES.SUBSCRIBERS,
                element: (
                  <ProtectedRoute permission={PermissionsEnum.SUBSCRIBER_READ}>
                    <SubscribersPage />
                  </ProtectedRoute>
                ),
                children: [
                  {
                    path: ROUTES.EDIT_SUBSCRIBER,
                    element: (
                      <ProtectedRoute
                        condition={(has) =>
                          has({ permission: PermissionsEnum.SUBSCRIBER_WRITE }) ||
                          has({ permission: PermissionsEnum.SUBSCRIBER_READ })
                        }
                        isDrawerRoute
                      >
                        <EditSubscriberPage />
                      </ProtectedRoute>
                    ),
                  },
                  {
                    path: ROUTES.CREATE_SUBSCRIBER,
                    element: (
                      <ProtectedRoute permission={PermissionsEnum.SUBSCRIBER_WRITE} isDrawerRoute>
                        <CreateSubscriberPage />
                      </ProtectedRoute>
                    ),
                  },
                ],
              },
              {
                path: ROUTES.TOPICS,
                element: (
                  <ProtectedRoute permission={PermissionsEnum.TOPIC_READ}>
                    <TopicsPage />
                  </ProtectedRoute>
                ),
                children: [
                  {
                    path: ROUTES.TOPICS_CREATE,
                    element: (
                      <ProtectedRoute permission={PermissionsEnum.TOPIC_WRITE} isDrawerRoute>
                        <CreateTopicPage />
                      </ProtectedRoute>
                    ),
                  },
                  {
                    path: ROUTES.TOPICS_EDIT,
                    element: (
                      <ProtectedRoute
                        condition={(has) =>
                          has({ permission: PermissionsEnum.TOPIC_WRITE }) ||
                          has({ permission: PermissionsEnum.TOPIC_READ })
                        }
                        isDrawerRoute
                      >
                        <EditTopicPage />
                      </ProtectedRoute>
                    ),
                  },
                ],
              },
              {
                path: ROUTES.CONTEXTS,
                element: (
                  <ProtectedRoute permission={PermissionsEnum.WORKFLOW_READ}>
                    <ContextsPage />
                  </ProtectedRoute>
                ),
                children: [
                  {
                    path: ROUTES.CONTEXTS_CREATE,
                    element: (
                      <ProtectedRoute permission={PermissionsEnum.WORKFLOW_WRITE} isDrawerRoute>
                        <CreateContextPage />
                      </ProtectedRoute>
                    ),
                  },
                  {
                    path: ROUTES.CONTEXTS_EDIT,
                    element: (
                      <ProtectedRoute permission={PermissionsEnum.WORKFLOW_READ} isDrawerRoute>
                        <EditContextPage />
                      </ProtectedRoute>
                    ),
                  },
                ],
              },
              {
                path: ROUTES.LAYOUTS,
                element: (
                  <ProtectedRoute permission={PermissionsEnum.WORKFLOW_READ}>
                    <LayoutsPage />
                  </ProtectedRoute>
                ),
                children: [
                  {
                    path: ROUTES.LAYOUTS_CREATE,
                    element: (
                      <ProtectedRoute permission={PermissionsEnum.WORKFLOW_WRITE} isDrawerRoute>
                        <CreateLayoutPage />
                      </ProtectedRoute>
                    ),
                  },
                  {
                    path: ROUTES.LAYOUTS_DUPLICATE,
                    element: (
                      <ProtectedRoute permission={PermissionsEnum.WORKFLOW_WRITE} isDrawerRoute>
                        <DuplicateLayoutPage />
                      </ProtectedRoute>
                    ),
                  },
                ],
              },
              {
                path: ROUTES.LAYOUTS_EDIT,
                element: (
                  <ProtectedRoute permission={PermissionsEnum.WORKFLOW_READ}>
                    <EditLayoutPage />
                  </ProtectedRoute>
                ),
              },
              {
                path: ROUTES.TRANSLATIONS,
                element: (
                  <ProtectedRoute permission={PermissionsEnum.WORKFLOW_READ}>
                    <TranslationsPage />
                  </ProtectedRoute>
                ),
                children: [
                  {
                    path: ROUTES.TRANSLATION_SETTINGS,
                    element: (
                      <ProtectedRoute permission={PermissionsEnum.WORKFLOW_READ}>
                        <TranslationSettingsPage />
                      </ProtectedRoute>
                    ),
                  },
                  {
                    path: ROUTES.TRANSLATIONS_EDIT,
                    element: (
                      <ProtectedRoute permission={PermissionsEnum.WORKFLOW_READ}>
                        <EditTranslationPage />
                      </ProtectedRoute>
                    ),
                  },
                ],
              },
              {
                path: ROUTES.AGENTS,
                element: <AgentsPage />,
              },
              {
                path: ROUTES.AGENT_DETAILS_INTEGRATIONS_DETAIL,
                element: (
                  <ProtectedRoute permission={PermissionsEnum.AGENT_READ}>
                    <AgentDetailsPage />
                  </ProtectedRoute>
                ),
              },
              {
                path: ROUTES.AGENT_DETAILS_TAB,
                element: (
                  <ProtectedRoute permission={PermissionsEnum.AGENT_READ}>
                    <AgentDetailsPage />
                  </ProtectedRoute>
                ),
              },
              {
                path: ROUTES.AGENT_DETAILS,
                element: (
                  <ProtectedRoute permission={PermissionsEnum.AGENT_READ}>
                    <AgentDetailsPage />
                  </ProtectedRoute>
                ),
              },
              {
                path: ROUTES.DOMAINS,
                element: !IS_SELF_HOSTED || IS_ENTERPRISE ? <DomainsPage /> : <Navigate to={ROUTES.ROOT} replace />,
              },
              {
                path: ROUTES.DOMAIN_DETAIL,
                element:
                  !IS_SELF_HOSTED || IS_ENTERPRISE ? <DomainDetailPage /> : <Navigate to={ROUTES.ROOT} replace />,
              },
              {
                path: ROUTES.API_KEYS,
                element: (
                  <ProtectedRoute permission={PermissionsEnum.API_KEY_READ}>
                    <ApiKeysPage />
                  </ProtectedRoute>
                ),
              },
              {
                path: ROUTES.ENVIRONMENTS,
                element: <EnvironmentsPage />,
              },
              {
                path: ROUTES.VARIABLES,
                element: <VariablesPage />,
                children: [
                  {
                    path: ROUTES.VARIABLES_CREATE,
                    element: (
                      <ProtectedRoute permission={PermissionsEnum.ORG_SETTINGS_WRITE} isDrawerRoute>
                        <UpsertVariablePage />
                      </ProtectedRoute>
                    ),
                  },
                ],
              },
              {
                path: ROUTES.ACTIVITY_FEED,
                element: (
                  <ProtectedRoute permission={PermissionsEnum.NOTIFICATION_READ}>
                    <ActivityFeed />
                  </ProtectedRoute>
                ),
              },
              {
                path: ROUTES.ACTIVITY_WORKFLOW_RUNS,
                element: (
                  <ProtectedRoute permission={PermissionsEnum.NOTIFICATION_READ}>
                    <ActivityFeed />
                  </ProtectedRoute>
                ),
              },
              {
                path: ROUTES.ACTIVITY_REQUESTS,
                element: (
                  <ProtectedRoute permission={PermissionsEnum.NOTIFICATION_READ}>
                    <ActivityFeed />
                  </ProtectedRoute>
                ),
              },
              {
                path: ROUTES.ACTIVITY_CONVERSATIONS,
                element: (
                  <ProtectedRoute permission={PermissionsEnum.NOTIFICATION_READ}>
                    <ActivityFeed />
                  </ProtectedRoute>
                ),
              },
              {
                path: ROUTES.ANALYTICS,
                element: (
                  <ProtectedRoute permission={PermissionsEnum.NOTIFICATION_READ}>
                    <AnalyticsPage />
                  </ProtectedRoute>
                ),
              },
              {
                path: ROUTES.EDIT_WORKFLOW,
                element: (
                  <ProtectedRoute permission={PermissionsEnum.WORKFLOW_READ}>
                    <EditWorkflowPage />
                  </ProtectedRoute>
                ),
                children: [
                  {
                    element: <ConfigureWorkflow />,
                    index: true,
                  },
                  {
                    element: <ConfigureStep />,
                    path: ROUTES.EDIT_STEP,
                  },

                  {
                    element: <EditStepTemplateV2Page />,
                    path: ROUTES.EDIT_STEP_TEMPLATE,
                  },
                  {
                    element: <EditStepConditions />,
                    path: ROUTES.EDIT_STEP_CONDITIONS,
                  },
                  {
                    element: <ChannelPreferences />,
                    path: ROUTES.EDIT_WORKFLOW_PREFERENCES,
                  },
                  {
                    path: ROUTES.TRIGGER_WORKFLOW,
                    element: (
                      <ProtectedRoute permission={PermissionsEnum.EVENT_WRITE} isDrawerRoute>
                        <TestWorkflowDrawerPage />
                      </ProtectedRoute>
                    ),
                  },
                ],
              },
              {
                path: ROUTES.EDIT_WORKFLOW_ACTIVITY,
                element: (
                  <ProtectedRoute permission={PermissionsEnum.WORKFLOW_READ}>
                    <EditWorkflowPage />
                  </ProtectedRoute>
                ),
              },
              {
                path: ROUTES.TEST_WORKFLOW,
                element: (
                  <ProtectedRoute permission={PermissionsEnum.EVENT_WRITE}>
                    <TestWorkflowRouteHandler />
                  </ProtectedRoute>
                ),
              },
              {
                path: ROUTES.WEBHOOKS_ENDPOINTS,
                element: (
                  <ProtectedRoute
                    condition={(has) =>
                      has({ permission: PermissionsEnum.WEBHOOK_READ }) ||
                      has({ permission: PermissionsEnum.WEBHOOK_WRITE })
                    }
                  >
                    <WebhooksPage />
                  </ProtectedRoute>
                ),
              },
              {
                path: ROUTES.WEBHOOKS_EVENT_CATALOG,
                element: (
                  <ProtectedRoute
                    condition={(has) =>
                      has({ permission: PermissionsEnum.WEBHOOK_READ }) ||
                      has({ permission: PermissionsEnum.WEBHOOK_WRITE })
                    }
                  >
                    <WebhooksPage />
                  </ProtectedRoute>
                ),
              },
              {
                path: ROUTES.WEBHOOKS_LOGS,
                element: (
                  <ProtectedRoute
                    condition={(has) =>
                      has({ permission: PermissionsEnum.WEBHOOK_READ }) ||
                      has({ permission: PermissionsEnum.WEBHOOK_WRITE })
                    }
                  >
                    <WebhooksPage />
                  </ProtectedRoute>
                ),
              },
              {
                path: ROUTES.WEBHOOKS_ACTIVITY,
                element: (
                  <ProtectedRoute
                    condition={(has) =>
                      has({ permission: PermissionsEnum.WEBHOOK_READ }) ||
                      has({ permission: PermissionsEnum.WEBHOOK_WRITE })
                    }
                  >
                    <WebhooksPage />
                  </ProtectedRoute>
                ),
              },
              {
                path: ROUTES.WEBHOOKS,
                element: (
                  <ProtectedRoute
                    condition={(has) =>
                      has({ permission: PermissionsEnum.WEBHOOK_READ }) ||
                      has({ permission: PermissionsEnum.WEBHOOK_WRITE })
                    }
                  >
                    <Navigate to={ROUTES.WEBHOOKS_ENDPOINTS} replace />
                  </ProtectedRoute>
                ),
              },
              {
                path: ROUTES.DISPATCH_HOME,
                element: (
                  <DispatchProtectedRoute>
                    <Outlet />
                  </DispatchProtectedRoute>
                ),
                children: [
                  { index: true, element: <DispatchDashboardPage /> },
                  { path: ROUTES.DISPATCH_AGENTS, element: <AgentsPage /> },
                  {
                    path: ROUTES.DISPATCH_AGENT_DETAILS_INTEGRATIONS_DETAIL,
                    element: (
                      <ProtectedRoute permission={PermissionsEnum.AGENT_READ}>
                        <AgentDetailsPage />
                      </ProtectedRoute>
                    ),
                  },
                  {
                    path: ROUTES.DISPATCH_AGENT_DETAILS_TAB,
                    element: (
                      <ProtectedRoute permission={PermissionsEnum.AGENT_READ}>
                        <AgentDetailsPage />
                      </ProtectedRoute>
                    ),
                  },
                  {
                    path: ROUTES.DISPATCH_AGENT_DETAILS,
                    element: (
                      <ProtectedRoute permission={PermissionsEnum.AGENT_READ}>
                        <AgentDetailsPage />
                      </ProtectedRoute>
                    ),
                  },
                  { path: ROUTES.DISPATCH_CONVERSATIONS, element: <DispatchConversationsPage /> },
                  { path: ROUTES.DISPATCH_API_KEYS, element: <DispatchApiKeysPage /> },
                  { path: ROUTES.DISPATCH_SETTINGS, element: <DispatchSettingsPage /> },
                ],
              },

              {
                path: '*',
                element: <CatchAllRoute />,
              },
            ],
          },
          {
            path: ROUTES.INTEGRATIONS,
            element: (
              <ProtectedRoute permission={PermissionsEnum.INTEGRATION_READ}>
                <IntegrationsListPage />
              </ProtectedRoute>
            ),
            children: [
              {
                path: ROUTES.INTEGRATIONS_CONNECT,
                element: (
                  <ProtectedRoute permission={PermissionsEnum.INTEGRATION_WRITE} isDrawerRoute>
                    <CreateIntegrationSidebar isOpened />
                  </ProtectedRoute>
                ),
              },
              {
                path: ROUTES.INTEGRATIONS_CONNECT_PROVIDER,
                element: (
                  <ProtectedRoute permission={PermissionsEnum.INTEGRATION_WRITE} isDrawerRoute>
                    <CreateIntegrationSidebar isOpened />
                  </ProtectedRoute>
                ),
              },
              {
                path: ROUTES.INTEGRATIONS_UPDATE,
                element: (
                  <ProtectedRoute
                    condition={(has) =>
                      has({ permission: PermissionsEnum.INTEGRATION_WRITE }) ||
                      has({ permission: PermissionsEnum.INTEGRATION_READ })
                    }
                    isDrawerRoute
                  >
                    <UpdateIntegrationSidebar isOpened />
                  </ProtectedRoute>
                ),
              },
            ],
          },
          {
            path: ROUTES.PARTNER_INTEGRATIONS_VERCEL,
            element: (
              <ProtectedRoute permission={PermissionsEnum.PARTNER_INTEGRATION_READ}>
                <VercelIntegrationPage />
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTES.SETTINGS,
            element: IS_SELF_HOSTED && !IS_ENTERPRISE ? <Navigate to={ROUTES.ROOT} /> : <SettingsPage />,
          },
          {
            path: ROUTES.SETTINGS_ACCOUNT,
            element: IS_SELF_HOSTED && !IS_ENTERPRISE ? <Navigate to={ROUTES.ROOT} /> : <SettingsPage />,
          },
          {
            path: ROUTES.SETTINGS_ORGANIZATION,
            element: IS_SELF_HOSTED && !IS_ENTERPRISE ? <Navigate to={ROUTES.ROOT} /> : <SettingsPage />,
          },
          {
            path: ROUTES.SETTINGS_TEAM,
            element: IS_SELF_HOSTED && !IS_ENTERPRISE ? <Navigate to={ROUTES.ROOT} /> : <SettingsPage />,
          },
          {
            path: ROUTES.SETTINGS_BILLING,
            element: IS_SELF_HOSTED ? <Navigate to={ROUTES.ROOT} /> : <SettingsPage />,
          },
          {
            path: ROUTES.LOCAL_STUDIO_AUTH,
            element: <RedirectToLegacyStudioAuth />,
          },
          {
            path: '*',
            element: <CatchAllRoute />,
          },
        ],
      },
    ],
  },
]);

const rootElement = document.getElementById('root');

if (!rootElement) throw new Error('Root element not found');

const issuerUri = import.meta.env.VITE_OIDC_ISSUER_URI ?? 'http://localhost:8080/realms/tiko';

function OidcLoading() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', fontFamily: 'system-ui, sans-serif', padding: 24,
    }}>
      <div style={{ maxWidth: 560 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 500 }}>
          Signing you in via Keycloak…
        </h2>
        <p style={{ marginTop: 8, color: '#888', fontSize: 14 }}>
          {issuerUri}
        </p>
      </div>
    </div>
  );
}

function OidcError({ oidcInitializationError }: { oidcInitializationError: { message?: string; isAuthServerLikelyDown?: boolean } }) {
  const serverDown = oidcInitializationError.isAuthServerLikelyDown;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', fontFamily: 'system-ui, sans-serif', padding: 24,
    }}>
      <div style={{ maxWidth: 640 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#b91c1c' }}>
          {serverDown ? 'Keycloak unreachable' : 'OIDC initialization failed'}
        </h2>
        <p style={{ marginTop: 12, color: '#444', lineHeight: 1.5 }}>
          {serverDown ? (
            <>
              The dashboard could not reach the OIDC server at <code>{issuerUri}</code>.
              Start it with <code>pnpm --filter auth dev</code> (docker) or{' '}
              <code>pnpm --filter auth dev:local</code> (native), then reload.
            </>
          ) : (
            <>{oidcInitializationError.message ?? 'Unknown error'}</>
          )}
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: 16, padding: '8px 16px', borderRadius: 6,
            border: '1px solid #ccc', background: '#f7f7f7', cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    </div>
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <OidcInitializationErrorGate errorComponent={OidcError}>
      <OidcInitializationGate fallback={<OidcLoading />}>
        <FeatureFlagsProvider>
          <RouterProvider router={router} />
        </FeatureFlagsProvider>
      </OidcInitializationGate>
    </OidcInitializationErrorGate>
  </StrictMode>
);
