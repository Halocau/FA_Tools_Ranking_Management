package backend.controller;

import backend.model.entity.Account;
import backend.model.request.LoginRequest;
import backend.service.IAccountService;
import backend.service.JWTService;

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

    private JWTService jwtService;

    @Autowired
    public AccountController(IAccountService iAccountService) {
        this.iAccountService = iAccountService;
    }

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
    public String generateAndValidateToken(@RequestParam String username,
            @RequestParam String password) {
        // Generate a JWT token using the provided account information
        Account account = iAccountService.findAccountByUsernameAndPassword(username, password);
        String token = iAccountService.verify(account);
        return token;
    }
}
