package com.example.backendnourpfe.respository;

import com.example.backendnourpfe.classes.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MessageRepository  extends JpaRepository<Message, Long> {
    @Query(value = """
    SELECT m.*
    FROM message m
    INNER JOIN (
        SELECT 
            LEAST(sender_id_utilisateur, receiver_id_utilisateur) AS user1,
            GREATEST(sender_id_utilisateur, receiver_id_utilisateur) AS user2,
            MAX(timestamp) AS max_time
        FROM message
        WHERE sender_id_utilisateur = :userId OR receiver_id_utilisateur = :userId
        GROUP BY user1, user2
    ) grouped ON (
        (LEAST(m.sender_id_utilisateur, m.receiver_id_utilisateur) = grouped.user1)
        AND (GREATEST(m.sender_id_utilisateur, m.receiver_id_utilisateur) = grouped.user2)
        AND m.timestamp = grouped.max_time
    )
    ORDER BY m.timestamp DESC
    """, nativeQuery = true)
    List<Message> findLastMessagesPerConversation(@Param("userId") Long userId);





    Optional<Message> findById(Long id);
    @Query("SELECT m FROM Message m WHERE " +
            "(m.sender.idUtilisateur = :senderId AND m.receiver.idUtilisateur = :receiverId) OR " +
            "(m.sender.idUtilisateur = :receiverId AND m.receiver.idUtilisateur = :senderId) " +
            "ORDER BY m.timestamp ASC")
    List<Message> findConversationBetweenUsers(@Param("senderId") Long senderId,
                                               @Param("receiverId") Long receiverId);




    // Trouver les messages non livrés pour un récepteur spécifique
    List<Message> findByReceiverIdUtilisateurAndDeliveredFalse(Long receiverId);
}
