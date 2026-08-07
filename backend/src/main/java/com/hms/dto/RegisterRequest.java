package com.hms.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    private String username;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    private String role; // ADMIN, DOCTOR, PATIENT

    // extra profile fields used when role == PATIENT
    private String fullName;
    private Integer age;
    private String gender;
    private String contact;
}
