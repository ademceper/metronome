package com.metronome.validators;

import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import org.keycloak.Config.Scope;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;
import org.keycloak.provider.ProviderConfigProperty;
import org.keycloak.validate.SimpleValidator;
import org.keycloak.validate.ValidationContext;
import org.keycloak.validate.ValidationError;
import org.keycloak.validate.ValidatorConfig;
import org.keycloak.validate.ValidatorFactory;

/**
 * Asserts that an ISO-8601 birth date (YYYY-MM-DD) belongs to someone at
 * least {@link #CFG_MIN_AGE} years old (default 18).
 *
 * <p>User profile usage:
 *
 * <pre>{@code
 * { "name": "birthDate",
 *   "annotations": { "inputType": "html5-date" },
 *   "validations": {
 *     "local-date": {},
 *     "min-age":    { "minAge": 18 }
 *   } }
 * }</pre>
 */
public class MinAgeValidator implements SimpleValidator, ValidatorFactory {

    public static final String ID = "min-age";
    public static final String CFG_MIN_AGE = "minAge";
    public static final String MESSAGE_TOO_YOUNG = "error-too-young";
    public static final String MESSAGE_INVALID_DATE = "error-invalid-date";

    @Override
    public String getId() {
        return ID;
    }

    @Override
    public ValidationContext validate(
            Object input,
            String inputHint,
            ValidationContext context,
            ValidatorConfig config) {
        String value = input == null ? "" : input.toString().trim();
        if (value.isEmpty()) return context;
        LocalDate dob;
        try {
            dob = LocalDate.parse(value, DateTimeFormatter.ISO_LOCAL_DATE);
        } catch (DateTimeParseException e) {
            context.addError(new ValidationError(ID, inputHint, MESSAGE_INVALID_DATE));
            return context;
        }
        int minAge = config == null ? 18 : config.getIntOrDefault(CFG_MIN_AGE, 18);
        int age = Period.between(dob, LocalDate.now()).getYears();
        if (age < minAge) {
            context.addError(
                    new ValidationError(ID, inputHint, MESSAGE_TOO_YOUNG, minAge));
        }
        return context;
    }

    // ─── ValidatorFactory ──────────────────────────────────────────────────

    private static final List<ProviderConfigProperty> CONFIG = List.of(
            new ProviderConfigProperty(
                    CFG_MIN_AGE,
                    "Minimum age",
                    "Reject the value when the birth date is younger than this many years.",
                    ProviderConfigProperty.STRING_TYPE,
                    "18"));

    @Override
    public List<ProviderConfigProperty> getConfigMetadata() {
        return CONFIG;
    }

    @Override
    public SimpleValidator create(KeycloakSession session) {
        return this;
    }

    @Override
    public void init(Scope config) {}

    @Override
    public void postInit(KeycloakSessionFactory factory) {}

    @Override
    public void close() {}
}
