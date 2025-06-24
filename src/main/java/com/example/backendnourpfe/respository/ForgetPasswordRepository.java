package com.example.backendnourpfe.respository;



import com.example.backendnourpfe.classes.ForgotPassword;
import com.example.backendnourpfe.classes.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ForgetPasswordRepository extends JpaRepository<ForgotPassword,Integer> {
    @Query("select fp from ForgotPassword  fp where  fp.otp= ?1 and fp.user= ?2")
    Optional<ForgotPassword>findByOtpAndUtlisateur(Integer otp, Utilisateur user);
}
