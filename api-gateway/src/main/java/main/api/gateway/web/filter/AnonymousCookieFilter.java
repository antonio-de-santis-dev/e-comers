package main.api.gateway.web.filter;// ============================================================
//  PERCORSO FILE:
//  api-gateway/src/main/java/<tuo-package>/web/filter/AnonymousCookieFilter.java
// ============================================================

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpCookie;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.UUID;

/**
 * Assegna un cookie anonimo ANON_ID a ogni utente non autenticato.
 * Propaga l'ID come header X-Anonymous-Id verso i microservizi downstream.
 *
 * FIX: usa beforeCommit() invece di doOnSuccess() per garantire che
 * il cookie venga aggiunto PRIMA che la risposta HTTP venga scritta
 * sul socket — evita "ServerHttpResponse already committed".
 */
@Component
public class AnonymousCookieFilter implements WebFilter {

    private static final Logger log = LoggerFactory.getLogger(AnonymousCookieFilter.class);

    public static final String COOKIE_NAME = "ANON_ID";
    public static final String HEADER_NAME = "X-Anonymous-Id";

    private static final Duration COOKIE_MAX_AGE = Duration.ofDays(30);

    /** Path da escludere: health check e actuator non hanno bisogno di cookie. */
    private static final String EXCLUDE_PREFIX = "/management/";

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {

        String path = exchange.getRequest().getURI().getPath();

        // Escludi health check e actuator — vengono chiamati ogni 5s dal Registry
        if (path != null && path.startsWith(EXCLUDE_PREFIX)) {
            return chain.filter(exchange);
        }

        HttpCookie existingCookie = exchange.getRequest()
            .getCookies()
            .getFirst(COOKIE_NAME);

        if (existingCookie != null) {
            // Cookie già presente: aggiungi solo l'header downstream, nessun nuovo cookie
            String anonId = existingCookie.getValue();
            log.debug("Utente anonimo esistente: ANON_ID={}", anonId);
            return chain.filter(addAnonHeader(exchange, anonId));
        }

        // Prima visita: genera nuovo ID anonimo
        String newAnonId = UUID.randomUUID().toString();
        log.debug("Nuovo utente anonimo: ANON_ID={}", newAnonId);

        ServerWebExchange enrichedExchange = addAnonHeader(exchange, newAnonId);

        // beforeCommit() si esegue PRIMA che la risposta venga scritta sul socket.
        // E' l'unico punto sicuro per aggiungere cookie in WebFlux.
        enrichedExchange.getResponse().beforeCommit(() -> {
            ResponseCookie cookie = ResponseCookie.from(COOKIE_NAME, newAnonId)
                .httpOnly(true)
                .path("/")
                .maxAge(COOKIE_MAX_AGE)
                .sameSite("Lax")
                // .secure(true)  // <- de-commentare in produzione HTTPS
                .build();
            enrichedExchange.getResponse().addCookie(cookie);
            log.debug("Cookie ANON_ID impostato: {}", newAnonId);
            return Mono.empty();
        });

        return chain.filter(enrichedExchange);
    }

    /**
     * Aggiunge l'header X-Anonymous-Id alla richiesta verso i microservizi.
     * Usa exchange.mutate() perché la request WebFlux e' immutabile.
     */
    private ServerWebExchange addAnonHeader(ServerWebExchange exchange, String anonId) {
        return exchange.mutate()
            .request(req -> req.header(HEADER_NAME, anonId))
            .build();
    }
}
