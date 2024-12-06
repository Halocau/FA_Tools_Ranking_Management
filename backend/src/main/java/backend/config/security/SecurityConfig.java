package backend.config.security;

import backend.model.entity.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.sql.DataSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JWTFilter jwtFilter;

    @Autowired
    private UserDetailsService userDetailsService;

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
//    @Bean
//    @Autowired
//    public JdbcUserDetailsManager userDetailsManager(DataSource dataSource) {
//        JdbcUserDetailsManager userDetailsManager = new JdbcUserDetailsManager(dataSource);
//        userDetailsManager.setUsersByUsernameQuery("SELECT username, password_hash, 1 AS enabled FROM Account WHERE username = ?");
//        userDetailsManager.setAuthoritiesByUsernameQuery(
//                "SELECT a.username, r.name AS role " +
//                        "FROM Account a " +
//                        "JOIN Role r ON a.role = r.role_id " +
//                        "WHERE a.username = ?"
//        );
//        return userDetailsManager;
//    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors() // Enable CORS
                .and()
                .csrf().disable() // Disable CSRF if needed
                .authorizeHttpRequests(
                        request -> request
                                .requestMatchers("/api/account/register",
                                        "/api/account/login",
                                        "/api/account/all",
                                        "/api/account/generate-and-validate",

                                        /* Ranking Group */
                                        "api/ranking-group",
                                        "api/ranking-group/get/**",

                                        /* Ranking Decision */
                                        "api/ranking-decision",
                                        "api/ranking-decision/all",
                                        "api/ranking-decision/get/**",

                                        /* Ranking Title */
                                        "api/ranking-title",
                                        "api/ranking-title/get/**",

                                        /* ranking-title-option */
                                        "api/ranking-title-option",
                                        "/api/ranking-title-option/get-decisionId/**",

                                        /* task */
                                        "api/task",
                                        "api/task/all",
                                        "api/task/get/**",
                                        "api/task/full",

                                        /* tasks-wage */
                                        "api/tasks-wage",

                                        /* option */
                                        "api/option/get/{id}",
                                        "api/option/all",

                                        /* employee */
                                        "api/employee",
                                        "api/employee/group/**",

                                        /* employee-criteria */
                                        "api/employee-criteria",
                                        "api/employee-criteria/get-groupId/**",

                                        /* decision-task */
                                        "api/decision-task",
                                        "api/decision-task/**",

                                        /*decision-criteria */
                                        "api/decision-criteria",
                                        "api/decision-criteria/get/**",
                                        "api/decision-criteria/get-all/**",
                                        "api/decision-criteria/options/**",

                                        /*bulk-ranking-history */
                                        "api/bulk-ranking-history"
                                )
                                .permitAll()

                                ///import file excel (.xlsx)
                                .requestMatchers(HttpMethod.POST, "api/storage/files").hasAnyAuthority("ADMIN")
                                .anyRequest()
                                 .authenticated()
//                                .permitAll()
                )
                // .formLogin().disable() // Disable form login
                // .httpBasic().disable() // Disable HTTP Basic authentication
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(NoOpPasswordEncoder.getInstance());
        provider.setUserDetailsService(userDetailsService);

        return provider;
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Apply to all endpoints
                        .allowedOrigins("http://localhost:5002") // Allow frontend on port 5002
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .exposedHeaders("Authorization") // Expose JWT token in header if needed
                        .allowCredentials(true); // Allow credentials like cookies
            }
        };
    }
}
