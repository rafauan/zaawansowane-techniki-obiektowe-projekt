package wsb.merito.zto.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "resource_ownership")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceOwnership {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long resourceId;

    @ManyToOne
    @JoinColumn(name = "owner_id", referencedColumnName = "id")
    private User owner;
}