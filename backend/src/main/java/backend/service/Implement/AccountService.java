package backend.service.Implement;

import backend.dao.IAccount;
import backend.model.entity.Account;
import backend.service.IAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class AccountService implements IAccountService {
    private IAccount iAccount;
    @Autowired
    public AccountService(IAccount iAccount) {
        this.iAccount = iAccount;
    }

    @Override
    public List<Account> getAllAccounts() {
        return iAccount.findAll();
    }

    @Override
    public Account findAccountById(int id) {
        return iAccount.findById(id).orElse(null);
    }

    @Override
    public Account findAccountByUsername(String username) {
        return iAccount.findAccountByUsername(username);
    }

    @Override
    public Account findAccountByEmail(String email) {
        return iAccount.findAccountByEmail(email);
    }

    @Override
    public Account findAccountByUsernameAndPassword(String username, String password) {
        return iAccount.findByUsernameAndPassword(username, password);
    }

    @Override
    public Account createAccount(Account account) {
        return iAccount.save(account);
    }

    @Override
    public Account updateAccount(Account account) {
        return iAccount.save(account);
    }

    @Override
    public void deleteAccount(int id) {
        iAccount.deleteById(id);
    }

    @Override
    public String findUsernameById(int id) {
        return iAccount.findUsernameById(id);
    }
}
