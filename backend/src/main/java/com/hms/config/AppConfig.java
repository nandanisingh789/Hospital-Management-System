package com.hms.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {

    /**
     * RestTemplate used by MLPredictionService to call the Python
     * Flask + Scikit-learn microservice for patient risk prediction.
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
