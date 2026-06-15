package com.metronome.events;

import org.jboss.logging.Logger;
import org.keycloak.Config.Scope;
import org.keycloak.events.Event;
import org.keycloak.events.EventListenerProvider;
import org.keycloak.events.EventListenerProviderFactory;
import org.keycloak.events.EventType;
import org.keycloak.events.admin.AdminEvent;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;

/**
 * Writes a single audit line for every successful REGISTER event with the
 * boolean consent attributes the user submitted. KVKK / fintech audits want
 * a tamper-evident record of which consents (kvkk / userAgreement /
 * marketingConsent / …) a given subject ticked, on what IP, at what
 * timestamp. We start by mirroring the values to the standard Keycloak log
 * channel — production should swap the {@code logger.info} for a write
 * into the consent ledger of choice (Postgres table, S3 object lock, …).
 */
public class ConsentAuditEventListenerProviderFactory
        implements EventListenerProviderFactory {

    public static final String ID = "metronome-consent-audit";
    private static final Logger LOG = Logger.getLogger("metronome.consent");

    @Override
    public String getId() {
        return ID;
    }

    @Override
    public EventListenerProvider create(KeycloakSession session) {
        return new Provider(session);
    }

    @Override
    public void init(Scope config) {}

    @Override
    public void postInit(KeycloakSessionFactory factory) {}

    @Override
    public void close() {}

    private static final class Provider implements EventListenerProvider {
        private final KeycloakSession session;

        Provider(KeycloakSession session) {
            this.session = session;
        }

        @Override
        public void onEvent(Event event) {
            if (event.getType() != EventType.REGISTER || event.getError() != null) {
                return;
            }
            var details = event.getDetails();
            if (details == null) return;

            String kvkk = details.getOrDefault("kvkkAccepted", "false");
            String agree = details.getOrDefault("userAgreementAccepted", "false");
            String marketing = details.getOrDefault("marketingConsent", "false");

            LOG.infof(
                    "consent_audit realm=%s userId=%s ip=%s ts=%d kvkk=%s userAgreement=%s marketing=%s",
                    event.getRealmId(),
                    event.getUserId(),
                    event.getIpAddress(),
                    event.getTime(),
                    kvkk,
                    agree,
                    marketing);
        }

        @Override
        public void onEvent(AdminEvent event, boolean includeRepresentation) {
            // We don't audit admin operations here. Add cases as needed.
        }

        @Override
        public void close() {}
    }
}
