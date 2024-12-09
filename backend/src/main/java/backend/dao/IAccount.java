package backend.dao;

import backend.model.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IAccount extends JpaRepository<Account, Integer> {
    public Account findByUsernameAndPassword(String username,String password);
    public Account findAccountByEmail(String email);
    public Account findAccountByUsername(String username);
    public String findUsernameById(int id);

    Optional<Object> findByUsername(String username);
}
