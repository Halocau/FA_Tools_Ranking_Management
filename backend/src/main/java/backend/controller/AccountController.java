package backend.controller;


import backend.model.Account;
import backend.model.dto.LoginRequest;
import backend.model.dto.LoginResponse;
import backend.security.TokenProvider;
import backend.security.exception.AccountException;
import backend.service.IAccountService;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/account")
public class AccountController {
    private IAccountService iAccountService;

    @Autowired
    public AccountController(IAccountService iAccountService) {
        this.iAccountService = iAccountService;
    }

    @Autowired
    private TokenProvider tokenProvider;

    @GetMapping("/user-and-pass")

    // http://localhost:8080/api/account/user-and-pass?username=quatbt&password=11111

    public ResponseEntity<Account> getAccountByUsernameAndPassword(
            @RequestParam String username,
            @RequestParam String password) {
        Account account = iAccountService.findAccountByUsernameAndPassword(username, password);
        if (account != null) {
            return ResponseEntity.ok(account);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @GetMapping("/all")
    public List<Account> getAllAccount() {
        return iAccountService.getAllAccounts();
    }

    @GetMapping("/login")
    public ResponseEntity<String> login(
            @RequestParam String username,
            @RequestParam String password) {
        // Find account by username and password
        Account account = iAccountService.findAccountByUsernameAndPassword(username, password);

        if (account != null) {

            // Generate JWT token
            // String token = tokenProvider.generateToken(account);

            // // Update the token and expiration in the database
            // account.setToken(token);
            // account.setTokenExpiration(LocalDateTime.now().plusHours(1)); // Token
            // expires in 1 hour

            // // Prepare response
            // LoginResponse response = new LoginResponse(
            // account.getId(),
            // account.getEmail(),
            // account.getRole(),
            // account.getStatus(),
            // account.getFullName(),
            // account.getDateOfBirth(),
            // account.getAddress(),
            // account.getPhoneNumber(),
            // account.getGender(),
            // token,
            // account.getTokenExpiration());

            return ResponseEntity.ok("Login successful");
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
    public String generateAndValidateToken(@RequestParam String username,
            @RequestParam String password) {
        // Generate a JWT token using the provided account information
        Account account = iAccountService.findAccountByUsernameAndPassword(username, password);
        String token = tokenProvider.generateToken(account);
        return token;
        // Validate the generated token
        // if (tokenProvider.validateToken(token)) {
        // return "Token generated and validated successfully!";
        // } else {
        // return "Token generation or validation failed!";
        // }
    }
}
