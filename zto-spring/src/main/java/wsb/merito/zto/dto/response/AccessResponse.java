package wsb.merito.zto.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AccessResponse {
    private boolean success;
    private AccessStatus status;
    private String message;
}