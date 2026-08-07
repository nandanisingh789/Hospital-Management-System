package com.hms.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Serves the JSP-based legacy admin pages via Spring MVC's
 * InternalResourceViewResolver (see MvcConfig). These pages complement the
 * React SPA and demonstrate the classic Servlet-controller -> JSP-view MVC
 * pattern used in the internship project.
 */
@Controller
public class JspPageController {

    @GetMapping("/register")
    public String registerPage() {
        return "register"; // resolves to /WEB-INF/jsp/register.jsp
    }

    @GetMapping("/dashboard")
    public String dashboardPage(HttpServletRequest request) {
        Object username = request.getSession().getAttribute("username");
        if (username == null) {
            return "redirect:/legacy-login";
        }
        return "dashboard"; // resolves to /WEB-INF/jsp/dashboard.jsp
    }
}
