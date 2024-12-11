package backend.service;

import backend.model.entity.Account;
import backend.model.dto.LoginResponse;
import java.util.List;
import java.util.Map;

public interface IAccountService {
    public List<Account> getAllAccounts();

    public Account findAccountById(int id);

    public Account findAccountByUsername(String username);

    public Account findAccountByEmail(String email);

    public Account findAccountByUsernameAndPassword(String username, String password);

    public Account createAccount(Account account);

    public Account updateAccount(Account account);

    public void deleteAccount(int id);

    public String findUsernameById(int id);

    public Map<String, String> verify(Account user);

    public LoginResponse login(Account user);
}
