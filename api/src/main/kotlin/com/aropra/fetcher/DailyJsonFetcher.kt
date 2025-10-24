package com.aropra.fetcher

import com.aropra.enum.Language
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient
import java.nio.file.Paths
import java.time.LocalDate
import java.time.ZoneId

@Service
class DailyJsonFetcher(
    private val properties: FetcherProperties,
    private val wc: WebClient,
) {
    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul")
    fun fetchAndSaveAllData() {
        Language.entries.forEach { lang ->
            fetchAndSaveData(lang)
        }
    }

    fun fetchAndSaveData(lang: Language) {
        val url = properties.urlTemplate.replace("{{language}}", lang.code)
        val json =
            wc
                .get()
                .uri(url)
                .retrieve()
                .bodyToMono(String::class.java)
                .block()
        val date = LocalDate.now(ZoneId.of("Asia/Seoul"))
        val path = Paths.get("./data").resolve(date.toString()).resolve("$lang.json")

        path
            .toFile()
            .apply {
                parentFile.mkdirs()
            }.writeText(json ?: "")
    }
}
