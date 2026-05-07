package chiTieu;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    
    @Query("SELECT u FROM User u WHERE u.username = :username AND u.pass = :password")
    Optional<User> findByUsernameAndPassword(@Param("username") String username, @Param("password") String password);
    
    Optional<User> findByUsername(String username);
} 