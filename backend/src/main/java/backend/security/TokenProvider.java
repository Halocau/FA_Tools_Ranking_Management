package backend.security;

import backend.model.Account;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Component
public class TokenProvider {

    // Secret key for signing JWT (keep this secret)
    private final String jwtSecret = "yourSuperSecretKey";

    // Token expiration time (1 hour in this case)
    private final int jwtExpirationInMs = 3600000;

    // Generate JWT token using jjwt
    public String generateToken(Account account) {
        Date now = new Date();
        Date expiryDate = Date.from(LocalDateTime.now().plusHours(1).atZone(ZoneId.systemDefault()).toInstant());

        return Jwts.builder()
                .setSubject(account.getUsername()) // Set the subject to username
                .claim("role", account.getRole()) // Add role claim
                .claim("accountId", account.getId()) // Add account ID claim
                .setIssuedAt(now) // Set issue date
                .setExpiration(expiryDate) // Set expiration date
                .signWith(SignatureAlgorithm.HS512, jwtSecret) // Sign with secret key
                .compact();
    }
}
