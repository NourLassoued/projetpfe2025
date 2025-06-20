package service;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.core.type.TypeReference;
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

        try {
            String responseJsonString = restTemplate.postForObject(flaskUrl, request, String.class);

            Map<String, Object> responseMap = objectMapper.readValue(responseJsonString, new TypeReference<Map<String, Object>>() {});
            String responseText = (String) responseMap.get("response");

            return responseText != null ? responseText : "Pas de réponse du chatbot";
        } catch (Exception e) {
            // Log erreur ici si tu as un logger, sinon printStackTrace
            e.printStackTrace();
            return "Erreur lors de la communication avec le chatbot.";
        }
    }
}