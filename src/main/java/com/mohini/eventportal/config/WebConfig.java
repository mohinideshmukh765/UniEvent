package com.mohini.eventportal.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve uploaded files from /uploads/** URL path
        String userDir = System.getProperty("user.dir");
        java.nio.file.Path uploadDir = java.nio.file.Paths.get(userDir, "uploads");
        String uploadPath = uploadDir.toFile().getAbsolutePath().replace("\\", "/");

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:/" + uploadPath + "/");
    }
}
