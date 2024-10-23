package backend.security;

import backend.model.Account;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
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

    // public boolean validateToken(String token) {
    // try {
    // Jwts.parser().setSigningKey(getKey()).parseClaimsJws(token);
    // return true;
    // } catch (MalformedJwtException | UnsupportedJwtException |
    // IllegalArgumentException e) {
    // System.out.println("Invalid JWT token: " + e.getMessage());
    // } catch (ExpiredJwtException e) {
    // System.out.println("JWT token has expired: " + e.getMessage());
    // } catch (SignatureException e) {
    // System.out.println("Invalid JWT signature: " + e.getMessage());
    // }
    // return false;
    // }

    // public String getUsernameFromToken(String token) {
    // Claims claims =
    // Jwts.parser().setSigningKey(getKey()).parseClaimsJws(token).getBody();
    // return claims.getSubject();
    // }

    // public Claims getAllClaimsFromToken(String token) {
    // return Jwts.parser().setSigningKey(getKey()).parseClaimsJws(token).getBody();
    // }

    private Key getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretkey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

}
