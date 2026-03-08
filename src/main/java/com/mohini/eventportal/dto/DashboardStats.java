package com.mohini.eventportal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStats {
    private long totalEvents;
    private long presentEvents;
    private long pastEvents;
    private long totalRegistrations;
}
