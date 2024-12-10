package wsb.merito.zto.dto.response;

public enum AccessStatus {
    ACCESS_GRANTED("Access granted to edit the resource."),
    ACCESS_DENIED("Access denied: You are not the owner of this resource."),
    RESOURCE_NOT_FOUND("The requested resource does not exist.");

    private final String message;

    AccessStatus(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}