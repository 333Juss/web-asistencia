package com.example.asistencia.config;
import com.example.asistencia.security.jwt.JwtAuthenticationEntryPoint;
import com.example.asistencia.security.jwt.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtAuthenticationEntryPoint unauthorizedHandler;

    @Autowired
    private CorsConfigurationSource corsConfigurationSource;

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Deshabilitar CSRF ya que es una API REST stateless
                .csrf(csrf -> csrf.disable())

                // Configurar CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource))

                // Configurar manejo de excepciones
                .exceptionHandling(exception ->
                        exception.authenticationEntryPoint(unauthorizedHandler)
                )

                // Configurar política de sesión como STATELESS
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Configurar autorización de peticiones
                .authorizeHttpRequests(auth -> auth
                        // Endpoints públicos
                        .requestMatchers(
                                "/api/auth/**",             // Autenticación
                                "/api/health/**",           // Health check
                                "/swagger-ui/**",           // Swagger UI
                                "/v3/api-docs/**",          // OpenAPI docs
                                "/swagger-ui.html",         // Swagger HTML
                                "/api-docs/**"              // API docs
                        ).permitAll()

                        // Endpoints de administración (ADMIN, RRHH)
                        .requestMatchers("/api/empresas/**", "/api/sedes/**", "/api/colaboradores/**")
                        .hasAnyRole("ADMIN", "RRHH")

                        // Endpoints de empleados
                        .requestMatchers("/api/asistencias/entrada", "/api/asistencias/salida", "/api/biometria/capturar-rostro")
                        .hasAnyRole("EMPLEADO", "ADMIN", "RRHH")

                        // Todos los demás endpoints requieren autenticación
                        .anyRequest().authenticated()
                )

                // Deshabilitar la página de login por defecto
                .formLogin(form -> form.disable())

                // Deshabilitar HTTP Basic
                .httpBasic(basic -> basic.disable());

        // Configurar el provider de autenticación
        http.authenticationProvider(authenticationProvider());

        // Agregar el filtro JWT antes del filtro de autenticación de usuario/contraseña
        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
