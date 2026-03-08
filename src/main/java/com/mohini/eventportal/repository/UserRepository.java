package com.mohini.eventportal.repository;

import com.mohini.eventportal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
// - [x] Verification: Debug email notification failure and DB constraints <!-- id: 56 -->
//     - [x] Enhance AdminController with count reporting and error logging <!-- id: 57 -->
//     - [x] Fixed App Password spacing and implemented re-send logic <!-- id: 58 -->
    - [ ] Implement atomic onboarding: Save to DB ONLY if email succeeds <!-- id: 60 -->
//     - [x] Handled unique email constraint violation in AdminController <!-- id: 59 -->
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    long countByRole(User.Role role);
}
