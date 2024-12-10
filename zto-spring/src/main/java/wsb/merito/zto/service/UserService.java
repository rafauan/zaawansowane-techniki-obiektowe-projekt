package wsb.merito.zto.service;

import lombok.RequiredArgsConstructor;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import wsb.merito.zto.dto.response.AccessResponse;
import wsb.merito.zto.dto.response.AccessStatus;
import wsb.merito.zto.entity.User;
import wsb.merito.zto.repository.ResourceOwnershipRepository;
import wsb.merito.zto.repository.UserRepository;

import java.util.Optional;

import org.slf4j.Logger;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private ResourceOwnershipRepository resourceOwnershipRepository;

    @Autowired
    private UserRepository repository;

    public Optional<User> findByEmail(String email) {
        return repository.findByEmail(email);
    }

    @Transactional
    public User save(User user) {
        return repository.save(user);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return findByEmail(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public Long getCurrentUserId() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ((User) userDetails).getId();
    }

    public AccessResponse canEditResource(Long resourceId) {
        Long currentUserId = getCurrentUserId();
        boolean isOwner = resourceOwnershipRepository.findByResourceIdAndOwnerId(resourceId, currentUserId).isPresent();

        if (isOwner) {
            return new AccessResponse(true, AccessStatus.ACCESS_GRANTED, AccessStatus.ACCESS_GRANTED.getMessage());
        } else {
            return new AccessResponse(false, AccessStatus.ACCESS_DENIED, AccessStatus.ACCESS_DENIED.getMessage());
        }
    }
}
