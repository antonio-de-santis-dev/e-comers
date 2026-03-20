package main.api.gateway.web.filter;// ============================================================
//  PERCORSO FILE:
//  api-gateway/src/main/java/<tuo-package>/web/filter/LoggingGatewayFilter.java
//
//  Sostituire <tuo-package> con il package base del progetto
//  (es. com.mycompany.ecommerce.gateway.web.filter)
// ============================================================

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

/**
 * Filtro globale di Spring Cloud Gateway che logga ogni richiesta che
 * transita dal Gateway verso i microservizi, registrando:
 *  - Metodo HTTP e path completo
 *  - Microservizio di destinazione (estratto dal path /services/<nome>/...)
 *  - Tipo utente (autenticato vs anonimo, con ANON_ID se disponibile)
 *  - Status HTTP della risposta
 *  - Durata totale della richiesta in millisecondi
 *
 * Esempi di log prodotti:
 *  → GET /services/mscatalogo/api/prodottos | ms=mscatalogo | utente=[anonimo:uuid-...]
 *  ← GET /services/mscatalogo/api/prodottos | ms=mscatalogo | status=200 | 47ms
 *  ← POST /services/msordini/api/ordines   | ms=msordini   | status=400 | 12ms [WARN]
 *
 * Ordering: HIGHEST_PRECEDENCE → il filtro parte prima di tutti gli altri,
 * catturando il tempo reale complessivo della richiesta.
 */
@Component
public class LoggingGatewayFilter implements GlobalFilter, Ordered {

    private static final Logger log = LoggerFactory.getLogger(LoggingGatewayFilter.class);

    /** Soglia ms oltre la quale la richiesta viene loggata come SLOW. */
    private static final long SLOW_REQUEST_THRESHOLD_MS = 2000;

    /** Header JWT — se presente, l'utente è autenticato. */
    private static final String AUTH_HEADER = "Authorization";

    /** Header impostato da AnonymousCookieFilter. */
    private static final String ANON_HEADER = AnonymousCookieFilter.HEADER_NAME;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        ServerHttpRequest request = exchange.getRequest();
        String method = request.getMethod().name();
        String path   = request.getURI().getPath();
        String ms     = extractMicroserviceName(path);
        String utente = resolveUserIdentity(request);

        long startTime = System.currentTimeMillis();

        // Log di ingresso
        log.info("→ {} {} | ms={} | utente={}", method, path, ms, utente);

        return chain.filter(exchange)
                .doOnSuccess(v  -> logResponse(method, path, ms, utente, startTime, exchange, null))
                .doOnError(err  -> logResponse(method, path, ms, utente, startTime, exchange, err));
    }

    // -------------------------------------------------------
    //  Metodi privati
    // -------------------------------------------------------

    /**
     * Logga la risposta al termine della chain reattiva.
     * Chiamato sia su successo che su errore grazie a doOnSuccess/doOnError.
     */
    private void logResponse(String method, String path, String ms,
                             String utente, long startTime,
                             ServerWebExchange exchange, Throwable err) {

        long duration = System.currentTimeMillis() - startTime;

        HttpStatus status = null;
        if (exchange.getResponse().getStatusCode() instanceof HttpStatus hs) {
            status = hs;
        }

        int statusCode = (status != null) ? status.value() : 0;
        boolean isError = (statusCode >= 400) || (err != null);
        boolean isSlow  = duration >= SLOW_REQUEST_THRESHOLD_MS;

        if (err != null) {
            // Eccezione non gestita nella chain
            log.error("← {} {} | ms={} | status=ERR | {}ms | utente={} | errore={}",
                    method, path, ms, duration, utente, err.getMessage());

        } else if (isError) {
            // 4xx / 5xx
            log.warn("← {} {} | ms={} | status={} | {}ms | utente={}{}",
                    method, path, ms, statusCode, duration, utente,
                    isSlow ? " [SLOW]" : "");

        } else if (isSlow) {
            // Risposta OK ma lenta
            log.warn("← {} {} | ms={} | status={} | {}ms | utente={} [SLOW]",
                    method, path, ms, statusCode, duration, utente);

        } else {
            // Tutto OK, veloce
            log.info("← {} {} | ms={} | status={} | {}ms | utente={}",
                    method, path, ms, statusCode, duration, utente);
        }
    }

    /**
     * Estrae il nome del microservizio dal path della richiesta.
     *
     * Esempi:
     *   /services/mscatalogo/api/prodottos → "mscatalogo"
     *   /api/authenticate                  → "gateway"
     *   /actuator/health                   → "actuator"
     */
    private String extractMicroserviceName(String path) {
        if (path == null) return "unknown";
        if (path.startsWith("/services/")) {
            String[] parts = path.split("/");
            // parts[0]="" parts[1]="services" parts[2]="<nome-ms>"
            return (parts.length > 2) ? parts[2] : "unknown";
        }
        if (path.startsWith("/api/"))       return "gateway";
        if (path.startsWith("/actuator/"))  return "actuator";
        return "gateway";
    }

    /**
     * Determina il tipo di utente dalla richiesta:
     *  - Se c'è Authorization header → "[autenticato]"
     *  - Se c'è X-Anonymous-Id       → "[anonimo:uuid]"
     *  - Altrimenti                  → "[sconosciuto]"
     */
    private String resolveUserIdentity(ServerHttpRequest request) {
        if (request.getHeaders().containsKey(AUTH_HEADER)) {
            return "[autenticato]";
        }
        String anonId = request.getHeaders().getFirst(ANON_HEADER);
        if (anonId != null && !anonId.isBlank()) {
            // Mostriamo solo i primi 8 caratteri per leggibilità nei log
            return "[anonimo:" + anonId.substring(0, Math.min(8, anonId.length())) + "...]";
        }
        return "[sconosciuto]";
    }

    /**
     * HIGHEST_PRECEDENCE → questo filtro viene eseguito PER PRIMO nella chain,
     * così il timer cattura l'intera durata reale della richiesta.
     */
    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }
}
