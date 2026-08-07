package com.hms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.boot.web.servlet.ServletComponentScan;

/**
 * Hospital Management System - Full Stack Web Application
 *
 * Tech Stack: Core Java, Spring Boot, Hibernate ORM, Spring MVC, Servlets, JSP,
 * JDBC, MySQL, React JS, Python (Scikit-learn) ML microservice, Razorpay API.
 *
 * Mirrors the MVC (Model-View-Controller) design used across the project:
 * Java entity models -> JSP/React views -> Servlet/REST controllers.
 */
@SpringBootApplication
@ServletComponentScan // enables @WebServlet (LegacyLoginServlet) auto-registration
public class HospitalManagementSystemApplication extends SpringBootServletInitializer {

    public static void main(String[] args) {
        SpringApplication.run(HospitalManagementSystemApplication.class, args);
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(HospitalManagementSystemApplication.class);
    }
}
