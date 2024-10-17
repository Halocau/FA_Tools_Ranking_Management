//package backend.backend.security;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.http.HttpMethod;
//
//
//import javax.sql.DataSource;
//
//@Configuration
//public class UserConfiguration {
//    //    @Bean
////    @Autowired
////    //vì đã cấu hình trong propertities
////    public JdbcUserDetailsManager userDetailsManager(DataSource dataSource) {
//////        JdbcUserDetailsManager userDetailsManager = new JdbcUserDetailsManager();
//////        userDetailsManager.setDataSource(dataSource);
//////        return userDetailsManager;
////        return new JdbcUserDetailsManager(dataSource);
////    }
//    @Bean
//    @Autowired
//    public JdbcUserDetailsManager userDetailsManager(DataSource dataSource) {
//        JdbcUserDetailsManager userDetailsManager = new JdbcUserDetailsManager(dataSource);
//        userDetailsManager.setUsersByUsernameQuery("Select id,pw,active from accounts where id=?");
//        userDetailsManager.setAuthoritiesByUsernameQuery("Select id,role from roles where id=?");
//        return userDetailsManager;
//    }
//
////    @Bean// cấu hình account dùng để test
////    public InMemoryUserDetailsManager inMemoryConfiguration() {
////        UserDetails quat = User.withUsername("quat")
////                .password("{noop}111")//mật khẩu plan test
////                .roles("teacher")
////                .build();
////
////        UserDetails manager = User.withUsername("manager")// người quản lý trong trường
////                .password("{noop}111")//mật khẩu plan test
////                .roles("manager")
////                .build();
////
////        UserDetails admin = User.withUsername("admin")
////                .password("{noop}111")//mật khẩu plan test
////                .roles("admin")
////                .build();
////
////        return new InMemoryUserDetailsManager(quat, manager, admin);
////    }
//
//    @Bean //tạo ra bộ lọc bằng lớp filter có sẵn là SecurityFilterChain
//    //requestMatchers()// kiểm tra từng request 1
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        // throws Exception: những case ngoại lệ thì quăng nó ra
//        http.authorizeHttpRequests(
//                configurer -> configurer
//                        //chung (phương thức get)
//                        .requestMatchers(HttpMethod.GET, "/api/students")
//                        .hasAnyRole("ADMIN", "MANAGER", "TEACHER")
//
//                        // tìm Student theo id
//                        .requestMatchers(HttpMethod.GET, "/api/students/**")
//                        .hasAnyRole("ADMIN", "MANAGER", "TEACHER")
//
//                        // Thêm sinh viên vào
//                        .requestMatchers(HttpMethod.POST, "/api/students/**")
//                        .hasAnyRole("ADMIN", "MANAGER")
//                        // Cập nhật thông tinh Student
//                        .requestMatchers(HttpMethod.PUT, "/api/students/**")
//                        .hasAnyRole("ADMIN", "MANAGER")
//
//                        //Xoá sinh viên
//                        .requestMatchers(HttpMethod.DELETE, "/api/students/**")
//                        .hasRole("ADMIN")
//
//        );
//        http.httpBasic(Customizer.withDefaults());//Cấu hình cơ chế xác thực cơ bản
//
//        http.csrf(csrf -> csrf.disable());//csrf: cross site request forgery: giả mạo request kiểu thay vì tương tác từ web thì sẽ tương tac bằng tool kiểu như postman
//        return http.build();
//    }
//}
