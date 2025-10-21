package com.aropra.fetcher

import org.springframework.beans.factory.annotation.Value
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient
import java.nio.file.Paths
import java.time.LocalDate
import java.time.ZoneId

@Service
class DailyJsonFetcher(
    @Value("\${app.fetcher.url}") private val url: String,
    private val wc: WebClient,
) {
    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul")
    fun fetchAndSaveAllData() {
        listOf("en", "jp", "kr").forEach { lang ->
            fetchAndSaveData(lang)
        }
    }

    fun fetchAndSaveData(lang: String) {
        val langUrl = url.replace("{{language}}", lang)
        val json =
            wc
                .get()
                .uri(langUrl)
                .retrieve()
                .bodyToMono(String::class.java)
                .block()
        val date = LocalDate.now(ZoneId.of("Asia/Seoul"))
        val path = Paths.get("./data", date.toString(), "$lang.json")

        path
            .toFile()
            .apply {
                parentFile.mkdirs()
            }.writeText(json ?: "")
    }
}
