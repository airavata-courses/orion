package com.orionweather.registry.rabbitmq;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    public static final Logger logger = LoggerFactory.getLogger(RabbitMQConfig.class);

    @Bean
    Queue userRequestQueue() {
        return new Queue("userRequest");
    }

    @Bean
    Queue ingestorResponseQueue() {
        return new Queue("ingestorResponse");
    }

    @Bean
    Queue plotterResponseQueue() {
        return new Queue("plotterResponse");
    }

    @Bean
    Queue statusRequestQueue() {
        return new Queue("statusRequest");
    }

    @Bean
    Queue registryStorageQueue() {
        return new Queue("registryStorage");
    }

    @Bean
    Queue registryStatusQueue() {
        return new Queue("registryStatus");
    }
    @Bean
    MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

}
