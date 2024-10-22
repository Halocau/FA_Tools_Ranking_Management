package backend.security;

import backend.model.Account;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Component
public class TokenProvider {

    // Generate a secure secret key for signing JWT tokens
    public static String generateSecretKey() throws NoSuchAlgorithmException {
        // Use KeyGenerator to generate a secret key for HMAC (HS512 algorithm)
        KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA512");
        keyGen.init(512); // 512-bit key for HS512 algorithm

        SecretKey secretKey = keyGen.generateKey();

        // Return the key encoded in Base64
        return Base64.getEncoder().encodeToString(secretKey.getEncoded());
    }

    // Generate JWT token containing username and role
    public String generateToken(Account account) {
        Date now = new Date();
        Date expiryDate = Date.from(LocalDateTime.now().plusHours(1).atZone(ZoneId.systemDefault()).toInstant());

        String secretKey = null;
        try {
            // Generate the secret key dynamically
            secretKey = generateSecretKey();
        } catch (NoSuchAlgorithmException e) {
            // Handle the exception (you can log it or rethrow a custom exception)
            throw new RuntimeException("Error generating secret key", e);
        }

        // Build and return the JWT token using the generated secret key
        return Jwts.builder()
                // .setSubject(account.getUsername()) // Set the subject to username
                .setIssuedAt(now) // Set the issue date
                .setExpiration(expiryDate) // Set expiration date (1 hour from now)
                .signWith(SignatureAlgorithm.HS512, secretKey) // Sign the token using the generated secret key and
                                                               // HS512 algorithm
                .compact();
    }

}
