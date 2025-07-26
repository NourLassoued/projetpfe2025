package com.example.backendnourpfe.controlleur;

import com.example.backendnourpfe.service.ChatbotService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/chatbot")
@CrossOrigin(origins = "*")
public class ChatbotController {

    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }
    @PostMapping("/chat")
    public Map<String, Object> chat(@RequestBody Map<String, String> payload) {
        String message = payload.get("message");
        String responseText = chatbotService.sendMessageToChatbot(message);

        Map<String, Object> response = new HashMap<>();
        response.put("response", responseText);
        return response;
    }
}