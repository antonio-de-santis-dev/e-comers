package main.ms.notifiche.repository;

import main.ms.notifiche.domain.Notifica;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificaRepository extends MongoRepository<Notifica, String> {
}
