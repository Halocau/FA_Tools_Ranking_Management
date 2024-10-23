// package backend.security;

// import org.springframework.security.core.context.SecurityContextHolder;
// import
// org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
// import org.springframework.stereotype.Component;
// import org.springframework.web.filter.OncePerRequestFilter;
// import jakarta.servlet.FilterChain;
// import jakarta.servlet.ServletException;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;
// import java.io.IOException;

// @Component
// public class TokenAuthenticationFilter extends OncePerRequestFilter {

// private final TokenProvider tokenProvider;

// public TokenAuthenticationFilter(TokenProvider tokenProvider) {
// this.tokenProvider = tokenProvider;
// }

// @Override
// protected void doFilterInternal(HttpServletRequest request,
// HttpServletResponse response, FilterChain chain)
// throws ServletException, IOException {
// String token = getTokenFromRequest(request);

// if (token != null && tokenProvider.validateToken(token)) {
// var userDetails = tokenProvider.getUserDetailsFromToken(token);
// var authentication = new UsernamePasswordAuthenticationToken(userDetails,
// null,
// userDetails.getAuthorities());
// authentication.setDetails(new
// WebAuthenticationDetailsSource().buildDetails(request));
// SecurityContextHolder.getContext().setAuthentication(authentication);
// }

// chain.doFilter(request, response);
// }

// private String getTokenFromRequest(HttpServletRequest request) {
// String bearerToken = request.getHeader("Authorization");
// return (bearerToken != null && bearerToken.startsWith("Bearer ")) ?
// bearerToken.substring(7) : null;
// }
// }
