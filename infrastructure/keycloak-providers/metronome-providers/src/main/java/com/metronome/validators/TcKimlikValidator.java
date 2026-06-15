package com.metronome.validators;

import org.keycloak.Config.Scope;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;
import org.keycloak.validate.SimpleValidator;
import org.keycloak.validate.ValidationContext;
import org.keycloak.validate.ValidationError;
import org.keycloak.validate.ValidatorConfig;
import org.keycloak.validate.ValidatorFactory;

/**
 * Türkiye Cumhuriyeti kimlik numarası (T.C. Kimlik No) checksum validator.
 *
 * <p>An 11-digit identifier; the 10th and 11th digits are derived from the
 * first nine. The pattern check alone (regex) is not enough — any random
 * 11-digit string would pass. The algorithm:
 *
 * <ol>
 *   <li>The first digit must be non-zero (1–9).</li>
 *   <li>Let {@code odd}  = d1 + d3 + d5 + d7 + d9 (sum of digits in odd positions).</li>
 *   <li>Let {@code even} = d2 + d4 + d6 + d8 (sum of digits in even positions).</li>
 *   <li>d10 = ((odd × 7) − even) mod 10.</li>
 *   <li>d11 = (odd + even + d10) mod 10.</li>
 * </ol>
 *
 * <p>Register the validator in the realm's user profile JSON:
 *
 * <pre>{@code
 * { "name": "tcKimlikNo",
 *   "validations": {
 *     "length":    { "min": 11, "max": 11 },
 *     "tc-kimlik": {}
 *   } }
 * }</pre>
 */
public class TcKimlikValidator implements SimpleValidator, ValidatorFactory {

    public static final String ID = "tc-kimlik";
    public static final String MESSAGE_INVALID = "error-tc-kimlik-invalid";

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
        if (!isValid(value)) {
            context.addError(new ValidationError(ID, inputHint, MESSAGE_INVALID));
        }
        return context;
    }

    /** Package-private so unit tests can hit the algorithm directly. */
    static boolean isValid(String s) {
        if (s.length() != 11) return false;
        for (int i = 0; i < 11; i++) {
            if (!Character.isDigit(s.charAt(i))) return false;
        }
        int[] d = new int[11];
        for (int i = 0; i < 11; i++) d[i] = s.charAt(i) - '0';
        if (d[0] == 0) return false;
        int odd = d[0] + d[2] + d[4] + d[6] + d[8];
        int even = d[1] + d[3] + d[5] + d[7];
        int c10 = Math.floorMod((odd * 7) - even, 10);
        int c11 = Math.floorMod(odd + even + d[9], 10);
        return c10 == d[9] && c11 == d[10];
    }

    // ─── ValidatorFactory ──────────────────────────────────────────────────

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
