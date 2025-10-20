package com.aropra.fetcher

import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient
import java.nio.file.Paths
import java.time.LocalDate
import java.time.ZoneId

@Service
class DailyJsonFetcher(
    private val originUrl: String,
    private val wc: WebClient,
    private val basePath: String,
) {
    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul")
    fun fetchAndSaveAllData() {
        listOf("en", "jp", "kr").forEach { lang ->
            fetchAndSaveData(lang)
        }
    }

    fun fetchAndSaveData(lang: String) {
        val url = originUrl.replace("{{language}}", lang)
        val json =
            wc
                .get()
                .uri(url)
                .retrieve()
                .bodyToMono(String::class.java)
                .block()
        val date = LocalDate.now(ZoneId.of("Asia/Seoul"))
        val path = Paths.get(basePath, date.toString(), "$lang.json")

        path
            .toFile()
            .apply {
                parentFile.mkdirs()
            }.writeText(json ?: "")
    }
}
