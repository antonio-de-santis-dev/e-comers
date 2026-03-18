package main.ms.notifiche;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import main.ms.notifiche.config.AsyncSyncConfiguration;
import main.ms.notifiche.config.EmbeddedKafka;
import main.ms.notifiche.config.EmbeddedMongo;
import main.ms.notifiche.config.JacksonConfiguration;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Base composite annotation for integration tests.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest(classes = { MsNotificheApp.class, JacksonConfiguration.class, AsyncSyncConfiguration.class })
@EmbeddedMongo
@EmbeddedKafka
public @interface IntegrationTest {
}
