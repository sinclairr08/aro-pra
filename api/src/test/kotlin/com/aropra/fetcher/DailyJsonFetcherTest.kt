package com.aropra.fetcher

import com.aropra.enum.Language
import org.springframework.boot.ApplicationRunner
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile

@Configuration
@Profile("daily-json-fetcher-test")
class DailyJsonFetcherTest {
    @Bean
    @ConditionalOnProperty(
        prefix = "daily-json-fetcher-test",
        name = ["enabled"],
        havingValue = "true",
        matchIfMissing = false,
    )
    fun run(fetcher: DailyJsonFetcher) =
        ApplicationRunner {
            fetcher.fetchAndSaveData(Language.KR)
        }
}
