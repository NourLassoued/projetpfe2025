package com.example.backendnourpfe.Respository;

import com.example.backendnourpfe.classes.Publication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface PublicationRepository extends JpaRepository<Publication, Long> {
    List<Publication> findByEntreprise_IdUtilisateur(Long entrepriseId);
    List<Publication> findAllByOrderByDatePublicationDesc();
    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END " +
            "FROM Publication p JOIN p.likedByUsers u " +
            "WHERE p.id = :publicationId AND u.idUtilisateur = :utilisateurId")
    boolean utilisateurADejaLike(@Param("publicationId") Long publicationId,
                                 @Param("utilisateurId") Long utilisateurId);


}
