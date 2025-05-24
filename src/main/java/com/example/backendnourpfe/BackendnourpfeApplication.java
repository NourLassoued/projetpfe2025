package com.example.backendnourpfe;


import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.TimeZone;

@SpringBootApplication
@EnableScheduling
public class BackendnourpfeApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendnourpfeApplication.class, args);
    }
    @PostConstruct
    public void init() {
        TimeZone.setDefault(TimeZone.getTimeZone("Africa/Tunis"));
        System.out.println("Timezone configurée sur Africa/Tunis");
    }

}
