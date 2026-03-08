package com.mohini.eventportal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String id;
    private String username;
    private String email;
    private List<String> roles;
    private String fullName;
    private String phone;
    private String district;
    private String collegeId;
    private String collegeName;

    public JwtResponse(String accessToken, String id, String username, String email, List<String> roles,
                       String fullName, String phone, String district, String collegeId, String collegeName) {
        this.token = accessToken;
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
        this.fullName = fullName;
        this.phone = phone;
        this.district = district;
        this.collegeId = collegeId;
        this.collegeName = collegeName;
    }
}
