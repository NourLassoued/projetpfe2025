package com.example.backendnourpfe.Controlleur;

import com.example.backendnourpfe.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/chatbot")
@CrossOrigin(origins = "*")
public class ChatbotController {

    @Autowired
    private ChatbotService chatbotService;

    @PostMapping("/chat")
    public Map<String, Object> chat(@RequestBody Map<String, String> payload) {
        String message = payload.get("message");
        String responseText = chatbotService.sendMessageToChatbot(message);

        Map<String, Object> response = new HashMap<>();
        response.put("response", responseText);
        return response;
    }
}