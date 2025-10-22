package com.aropra.fetcher

import org.springframework.boot.ApplicationRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile

@Configuration
@Profile("daily-json-fetcher-test")
class DailyJsonFetcherTest {
    @Bean
    fun run(fetcher: DailyJsonFetcher) =
        ApplicationRunner {
            fetcher.fetchAndSaveData("kr")
        }
}
