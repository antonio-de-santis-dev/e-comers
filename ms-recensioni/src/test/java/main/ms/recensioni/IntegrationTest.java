package main.ms.recensioni;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import main.ms.recensioni.config.AsyncSyncConfiguration;
import main.ms.recensioni.config.EmbeddedKafka;
import main.ms.recensioni.config.EmbeddedMongo;
import main.ms.recensioni.config.JacksonConfiguration;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Base composite annotation for integration tests.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest(classes = { MsRecensioniApp.class, JacksonConfiguration.class, AsyncSyncConfiguration.class })
@EmbeddedMongo
@EmbeddedKafka
public @interface IntegrationTest {
}
