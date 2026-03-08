package com.mohini.eventportal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendCoordinatorCredentials(String toEmail, String fullName, String username, String password) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("kolhapuruniversityevents@gmail.com");
        message.setTo(toEmail);
        message.setSubject("UniEvent Portal - Coordinator Credentials");
        message.setText("Dear " + fullName + ",\n\n" +
                "You have been registered as a coordinator for your college on the UniEvent Portal.\n\n" +
                "Your login credentials are:\n" +
                "Username: " + username + "\n" +
                "Password: " + password + "\n\n" +
                "Please login and change your password as soon as possible.\n\n" +
                "Best regards,\n" +
                "UniEvent Admin Team");
        mailSender.send(message);
    }
}
