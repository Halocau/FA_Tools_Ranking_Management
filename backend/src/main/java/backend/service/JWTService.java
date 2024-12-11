package backend.service;

import backend.model.entity.Account;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.io.Decoders;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.function.Function;

@Service
public class JWTService {

    @Value("${jwt.accesstoken.secret}")
    private String accessKey;

    @Value("${jwt.refreshtoken.secret}")
    private String refreshkey;

    public String generateToken(Account account) {
        Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
                .claims()
                .add(claims)
                .subject(account.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 5))
                // .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 30))
                .and()
                .signWith(getKey(accessKey))
                .compact();
    }

    public String generateRefreshToken(Account account) {
        Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
                .claims()
                .add(claims)
                .subject(account.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 30))
                .and()
                .signWith(getKey(refreshkey))
                .compact();
    }

    private SecretKey getKey(String key) {
        byte[] keyBytes = Base64.getDecoder().decode(key);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // extract the username from jwt token
    public String extractUserName(String token, String type) {
        if (type.equals("refresh")) {
            return extractClaim(token, refreshkey, Claims::getSubject);
        } else
            return extractClaim(token, accessKey, Claims::getSubject);
    }

    private <T> T extractClaim(String token, String key, Function<Claims, T> claimResolver) {
        final Claims claims = extractAllClaims(token, key);
        return claimResolver.apply(claims);
    }

    private Claims extractAllClaims(String token, String key) {
        return Jwts.parser()
                .verifyWith(getKey(key))
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String userName = extractUserName(token, "access");
        return (userName.equals(userDetails.getUsername()) && !isTokenExpired(token, accessKey));
    }

    public boolean validateRefreshToken(String token, UserDetails userDetails) {
        final String userName = extractUserName(token, "refresh");
        return (userName.equals(userDetails.getUsername()) && !isTokenExpired(token, refreshkey));
    }

    private boolean isTokenExpired(String token, String key) {
        if (extractExpiration(token, key).before(new Date())) {
            System.out.println("EXPIRED TOKEN");
        } else {
            System.out.println("NOT EXPIRED TOKEN");
        }
        return extractExpiration(token, key).before(new Date());
    }

    private Date extractExpiration(String token, String key) {
        return extractClaim(token, key, Claims::getExpiration);
    }
}
