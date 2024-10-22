package backend.controller;


import backend.model.Account;
import backend.security.exception.AccountException;
import backend.service.IAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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

    @GetMapping("/user-and-pass")
    //http://localhost:8080/api/account/user-and-pass?username=quatbt&password=11111
    public ResponseEntity<Account> getAccountByUsernameAndPassword(
            @RequestParam String username,
            @RequestParam String password) {
        Account account = iAccountService.findAccountByUsernameAndPassword(username, password);
        if (account != null) {
            return ResponseEntity.ok(account);
        } else {
            throw new AccountException("Fail Login !!!");
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // Trả về 401 nếu không hợp lệ
        }
    }
}
