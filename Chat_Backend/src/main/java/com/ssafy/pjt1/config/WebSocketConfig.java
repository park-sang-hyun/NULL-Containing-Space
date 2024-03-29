package com.ssafy.pjt1.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer{

	@Override
	public void configureMessageBroker(MessageBrokerRegistry config) {
		// TODO Auto-generated method stub
		config.enableSimpleBroker("/sub");
		config.setApplicationDestinationPrefixes("pub");
	}
	
	@Override
	// connection 맺을때 CORS 허용하기
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		registry.addEndpoint("/chatting").setAllowedOrigins("*").withSockJS();
	}
}