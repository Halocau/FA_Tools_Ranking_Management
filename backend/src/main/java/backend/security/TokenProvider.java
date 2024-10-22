package backend.security;

import backend.model.Account;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.io.Decoders;

import org.springframework.stereotype.Component;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.security.Key;

@Component
public class TokenProvider {

    private String secretkey = "secretkey";

    public TokenProvider() {
        try {
            KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA256");
            SecretKey sk = keyGen.generateKey();
            secretkey = Base64.getEncoder().encodeToString(sk.getEncoded());
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    // // Generate a secure secret key for signing JWT tokens
    // public static String generateSecretKey() throws NoSuchAlgorithmException {
    // // Use KeyGenerator to generate a secret key for HMAC (HS512 algorithm)
    // KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA512");
    // keyGen.init(512); // 512-bit key for HS512 algorithm

    // SecretKey secretKey = keyGen.generateKey();

    // // Return the key encoded in Base64
    // return Base64.getEncoder().encodeToString(secretKey.getEncoded());
    // }

    public String generateToken(Account account) {

        Map<String, Object> claims = new HashMap<>();

        return Jwts.builder()
                .claims()
                .add(claims)
                .subject(account.getUsername())
                .issuedAt(Date.from(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant()))
                .expiration(Date.from(LocalDateTime.now().plusMinutes(30).atZone(ZoneId.systemDefault()).toInstant()))
                .and()
                .signWith(getKey())
                .compact();
    }

    private Key getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretkey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

}
