package wsb.merito.zto.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import wsb.merito.zto.dto.request.SignInRequest;
import wsb.merito.zto.dto.request.SignUpRequest;
import wsb.merito.zto.dto.response.AuthResponse;
import wsb.merito.zto.service.AuthenticationService;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signUp(@RequestBody SignUpRequest request) {
        String jwt = authenticationService.signUp(request);
        return ResponseEntity.ok(new AuthResponse(jwt));
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signIn(@RequestBody SignInRequest request) {
        String jwt = authenticationService.signIn(request);
        return ResponseEntity.ok(new AuthResponse(jwt));
    }
}
