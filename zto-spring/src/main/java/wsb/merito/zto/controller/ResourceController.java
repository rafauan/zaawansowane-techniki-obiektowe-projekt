package wsb.merito.zto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import wsb.merito.zto.dto.response.AccessResponse;
import wsb.merito.zto.service.UserService;

@RestController
@RequestMapping("/api/v1/resources")
public class ResourceController {

    @Autowired
    private UserService userService;

    // Endpoint to check if a user can edit a resource
    @PostMapping("/{resourceId}/edit")
    public AccessResponse editResource(@PathVariable Long resourceId) {
        return userService.canEditResource(resourceId);
    }
}