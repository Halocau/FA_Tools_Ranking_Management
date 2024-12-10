package backend.controller;

import backend.model.entity.Account;
import backend.model.form.LoginRequest;
import backend.service.IAccountService;
import backend.service.JWTService;
import backend.service.MyUserDetailsService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.context.ApplicationContext;

@RestController
@RequestMapping("api/auth")
public class AuthController {

    private IAccountService iAccountService;

    private JWTService jwtService;

    private ApplicationContext context;

    @Autowired
    public AuthController(IAccountService iAccountService, JWTService jwtService, ApplicationContext context) {
        this.jwtService = jwtService;
        this.iAccountService = iAccountService;
        this.context = context;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Account account = iAccountService.findAccountByUsernameAndPassword(loginRequest.getUsername(),
                loginRequest.getPassword());
        if (account != null) {
            return ResponseEntity.ok(iAccountService.login(account));
        } else {
            return ResponseEntity.status(401).body(null); // Unauthorized
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Account account) {
        if (iAccountService.findAccountByUsername(account.getUsername()) != null) {
            return ResponseEntity.status(400).body("Username already exists");
        }
        Account savedAccount = iAccountService.createAccount(account);
        savedAccount.setPassword(null);
        return ResponseEntity.status(201).body(savedAccount);
    }

    @GetMapping("/generate-and-validate")
    public Map<String, String> generateAndValidateToken(@RequestParam String username,
            @RequestParam String password) {
        // Generate a JWT token using the provided account information
        Account account = iAccountService.findAccountByUsernameAndPassword(username, password);
        Map<String, String> token = iAccountService.verify(account);
        return token;
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> token) {
        try {
            Map<String, String> response = new HashMap<>();
            // System.out.println(jwtService.isTokenExpired(refreshToken, "refresh"));
            // Extract username from the refresh token (without trimming)
            // System.out.println(jwtService.validateRefreshToken(refreshToken, null));
            // String username = jwtService.extractUserName(token.get("refreshToken"),
            // "refresh");
            String refreshToken = token.get("refreshToken");
            String username = jwtService.extractUserName(token.get("refreshToken"),
                    "refresh");

            UserDetails userDetails = context.getBean(MyUserDetailsService.class).loadUserByUsername(username);
            if (jwtService.validateRefreshToken(refreshToken, userDetails)) {
                response = iAccountService.verify(iAccountService.findAccountByUsername(username));
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(401).body(refreshToken + " is invalid");
            }
            // return ResponseEntity.ok(token);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(401).body(e);
        }
    }

}
