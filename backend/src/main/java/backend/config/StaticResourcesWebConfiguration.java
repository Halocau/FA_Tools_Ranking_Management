package backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourcesWebConfiguration
        implements WebMvcConfigurer {
    @Value("${backend.upload-file.base-uri}")
    private String baseURI;//value environment

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/storage/**")// mỗi lần vào /storage thì spring sẽ tự tìm basePath
                .addResourceLocations(baseURI);
    }
}