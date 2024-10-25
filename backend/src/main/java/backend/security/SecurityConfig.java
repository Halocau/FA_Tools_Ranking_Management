// package backend.security;

// import backend.security.TokenAuthenticationFilter;
// import backend.security.TokenProvider;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.authentication.AuthenticationManager;
// import
// org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
// import
// org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.http.SessionCreationPolicy;
// import
// org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
// import org.springframework.security.web.SecurityFilterChain;

// @Configuration
// public class SecurityConfig {

// private final TokenProvider tokenProvider;

// public SecurityConfig(TokenProvider tokenProvider) {
// this.tokenProvider = tokenProvider;
// }

// @Bean
// public SecurityFilterChain securityFilterChain(HttpSecurity http) throws
// Exception {
// http
// .csrf().disable()
// .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
// .and()
// .authorizeHttpRequests()
// .requestMatchers("/auth/login").permitAll()
// .anyRequest().authenticated()
// .and()
// .addFilterBefore(new TokenAuthenticationFilter(tokenProvider),
// UsernamePasswordAuthenticationFilter.class);

// return http.build();
// }

// @Bean
// public AuthenticationManager
// authenticationManager(AuthenticationConfiguration
// authenticationConfiguration) throws Exception {
// return authenticationConfiguration.getAuthenticationManager();
// }
// }
