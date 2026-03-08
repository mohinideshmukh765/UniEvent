package com.mohini.eventportal.controller;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @Value("${stripe.publishable.key}")
    private String stripePublishableKey;

    /**
     * Returns the publishable key to the frontend (safe to expose).
     */
    @GetMapping("/config")
    public ResponseEntity<?> getConfig() {
        return ResponseEntity.ok(Map.of("publishableKey", stripePublishableKey));
    }

    /**
     * Creates a Stripe Checkout Session and returns the session URL.
     * The frontend redirects the user to this URL to complete payment.
     */
    @PostMapping("/createSession")
    public ResponseEntity<?> createCheckoutSession(@RequestBody Map<String, Object> data) {
        try {
            Stripe.apiKey = stripeSecretKey;

            int amount = Integer.parseInt(data.get("amount").toString()); // amount in INR
            String eventName = data.getOrDefault("eventName", "Event Registration").toString();
            String successUrl = data.getOrDefault("successUrl", "http://localhost:8080/coordinator/index.html?payment=success").toString();
            String cancelUrl  = data.getOrDefault("cancelUrl",  "http://localhost:8080/coordinator/index.html?payment=cancelled").toString();

            SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(successUrl)
                .setCancelUrl(cancelUrl)
                .addLineItem(
                    SessionCreateParams.LineItem.builder()
                        .setQuantity(1L)
                        .setPriceData(
                            SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency("inr")
                                .setUnitAmount((long) amount * 100) // paise
                                .setProductData(
                                    SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                        .setName(eventName)
                                        .build()
                                )
                                .build()
                        )
                        .build()
                )
                .build();

            Session session = Session.create(params);
            return ResponseEntity.ok(Map.of(
                "sessionId", session.getId(),
                "url", session.getUrl()
            ));

        } catch (StripeException e) {
            return ResponseEntity.badRequest().body("Stripe error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
