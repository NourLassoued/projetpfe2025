package com.example.backendnourpfe.respository;

import com.example.backendnourpfe.classes.Notification;
import com.example.backendnourpfe.classes.Publication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    @Query("SELECT n.publication FROM Notification n WHERE n.user.idUtilisateur = :userId AND n.isSeen = false")
    List<Publication> findUnseenPublicationsByUserId(@Param("userId") Long userId);

    List<Notification> findByUserIdUtilisateur(Long userId);

    List<Notification> findByUserIdUtilisateurAndIsSeenOrderByPublication_DatePublicationDesc(Long userId, Boolean isSeen);

    Optional<Notification> findByUser_IdUtilisateurAndPublication_Id(Long userId, Long publicationId);
}
