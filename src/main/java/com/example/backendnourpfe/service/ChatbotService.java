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

        // Envoie POST et récupère la réponse JSON sous forme de String brute
        String responseJsonString = restTemplate.postForObject(flaskUrl, request, String.class);

        try {
            // Convertir la String JSON en Map
            Map<String, Object> responseMap = objectMapper.readValue(responseJsonString, Map.class);

            // Extraire la valeur décodée de la clé "response"
            String responseText = (String) responseMap.get("response");

            return responseText;
        } catch (Exception e) {
            e.printStackTrace();
            // En cas d'erreur, retourne la réponse brute
            return responseJsonString;
        }
    }
}
