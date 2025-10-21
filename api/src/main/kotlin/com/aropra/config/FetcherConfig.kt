package com.aropra.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.reactive.function.client.WebClient

@Configuration
class FetcherConfig {
    @Bean
    fun webClient(): WebClient = WebClient.create()
}
