package com.orionweather.registry.rabbitmq;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.orionweather.registry.model.IngestorResponse;
import com.orionweather.registry.model.PlotterResponse;
import com.orionweather.registry.model.RegistryEntry;
import com.orionweather.registry.model.UserRequest;
import com.orionweather.registry.model.UIMessage.UIMessageBuilder;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Service
public class PublishService {

    @Autowired
    private final RabbitTemplate rabbitTemplate;

    public PublishService(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }
//
//    @Scheduled(fixedDelay = 5000)
//    public void pushMessage() {
//        String messageString = "Hello Rabbit @ " + LocalTime.now().format(DateTimeFormatter.ISO_TIME);
//        rabbitTemplate.convertAndSend("hello", messageString);
//    }
//
//    @Scheduled(fixedDelay = 5000)
//    public void publishMessage() {
//	    rabbitTemplate.convertAndSend("helloPojo",
//	                  new UIMessageBuilder().data("Hello I'm still alive "+LocalTime.now()).sourceTag("registry").destinationTag("you").build());
////        rabbitTemplate.convertAndSend("helloPojo", new UIMessage("Hello Rabbit", LocalTime.now().format(DateTimeFormatter.ISO_TIME)));
//    }

    public void pushStorageStatus(String storageStatus) {
        rabbitTemplate.convertAndSend("registryStorage", storageStatus);
    }

    public void pushStatus(RegistryEntry registryEntry) {
    	rabbitTemplate.convertAndSend("registryStatus", registryEntry);
    }
}
