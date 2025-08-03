package chiTieu;

import jakarta.persistence.*;

@Entity
@Table(name = "user")
public class User {
    @Id
    private Integer id;

    @Column(name = "fullname", nullable = false)
    private String fullname;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "pass", nullable = false)
    private String pass;

    // Constructors
    public User() {}

    public User(Integer id, String fullname, String username, String pass) {
        this.id = id;
        this.fullname = fullname;
        this.username = username;
        this.pass = pass;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPass() {
        return pass;
    }

    public void setPass(String pass) {
        this.pass = pass;
    }
} 