package com.aropra.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.client.reactive.ReactorClientHttpConnector
import org.springframework.web.reactive.function.client.WebClient
import reactor.netty.http.client.HttpClient
import java.time.Duration

@Configuration
class FetcherConfig {
    @Bean
    fun webClient(): WebClient {
        val httpClient = HttpClient.create().responseTimeout(Duration.ofSeconds(30))

        return WebClient.builder().clientConnector(ReactorClientHttpConnector(httpClient)).build()
    }
}
