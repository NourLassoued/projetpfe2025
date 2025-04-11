package com.example.backendnourpfe;

import lombok.RequiredArgsConstructor;



import org.springframework.context.annotation.Configuration;


import org.springframework.messaging.simp.config.MessageBrokerRegistry;



import org.springframework.web.socket.config.annotation.*;




@Configuration
@EnableWebSocketMessageBroker

@RequiredArgsConstructor
public class WebsocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {

        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Enregistrement du point de terminaison STOMP avec SockJS
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")  // Autoriser les connexions depuis Angular
                .withSockJS(); // Utilisation de SockJS comme fallback
    }
}