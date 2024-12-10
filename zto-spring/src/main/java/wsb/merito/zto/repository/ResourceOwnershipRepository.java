package wsb.merito.zto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import wsb.merito.zto.entity.ResourceOwnership;

import java.util.Optional;

public interface ResourceOwnershipRepository extends JpaRepository<ResourceOwnership, Long> {
    Optional<ResourceOwnership> findByResourceIdAndOwnerId(Long resourceId, Long ownerId);
}