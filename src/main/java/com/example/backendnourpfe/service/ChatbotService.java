package com.example.backendnourpfe.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
@Service
public class ChatbotService {
    private final RestTemplate restTemplate = new RestTemplate();
    private final String flaskUrl = "http://127.0.0.1:5005/chat";
    private final ObjectMapper objectMapper = new ObjectMapper();
    public String sendMessageToChatbot(String message) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> body = new HashMap<>();
        body.put("message", message);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

        String responseJsonString = restTemplate.postForObject(flaskUrl, request, String.class);

        try {
            Map<String, Object> responseMap = objectMapper.readValue(responseJsonString, Map.class);

            String responseText = (String) responseMap.get("response");

            return responseText;
        } catch (Exception e) {
            e.printStackTrace();
            return responseJsonString;
        }
    }
}
