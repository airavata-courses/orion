package com.orionweather.registry.rabbitmq;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import com.orionweather.registry.controller.RegistryController;
import com.orionweather.registry.model.IngestorResponse;
import com.orionweather.registry.model.PlotterResponse;
import com.orionweather.registry.model.RegistryEntry;
import com.orionweather.registry.model.RequestEntry;
import com.orionweather.registry.model.UIMessage;
import com.orionweather.registry.model.UserRequest;

@Service
public class ListenerService {

    public static final Logger logger = LoggerFactory.getLogger(ListenerService.class);

    @Autowired
    PublishService publishService;

    @Autowired
    RegistryController registryController;

    @RabbitListener(queues = "userRequest")
    public void getUserRequest(UserRequest userRequest) {
        logger.info("From UserRequest Queue : {}", userRequest);
        registryController.addRequestHandler(userRequest);
        publishService.pushStorageStatus("success storing user request");
    }

    @RabbitListener(queues = "ingestorResponse")
    public void getIngestorResponse(IngestorResponse ingestorResponse) {
        logger.info("From Ingestor Queue : {}", ingestorResponse);
        registryController.ingestorResponseHandler(ingestorResponse);
        publishService.pushStorageStatus("success storing ingestor response");
    }

    @RabbitListener(queues = "plotterResponse")
    public void getPlotterResponse(PlotterResponse plotterResponse) {
        logger.info("From Plotter Queue : {}", plotterResponse);
        registryController.plotterResponseHandler(plotterResponse);
        publishService.pushStorageStatus("success storing plotter response");
    }

    @RabbitListener(queues = "statusRequest")
    public void getStatus(String message) {
        logger.info("From Status Request Queue : {}", message);
        publishService.pushStatus(new RegistryEntry());
    }

    @RabbitListener(queues = "registryStorage")
    public void getStorage(String message) {
        logger.info("We sent this Storage Queue : {}", message);
    }
    @RabbitListener(queues = "registryStatus")
    public void getRegStatus(String message) {
        logger.info("We sent this Status Queue : {}", message);
    }
}
