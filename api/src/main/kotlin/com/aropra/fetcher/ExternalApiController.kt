package com.aropra.fetcher

import com.aropra.domain.ExternalStudent
import com.aropra.enum.Language
import org.springframework.cache.annotation.Cacheable
import org.springframework.core.ParameterizedTypeReference
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.reactive.function.client.WebClient
import java.net.URI

@RestController
@RequestMapping("/api/v1/fetch")
class ExternalApiController(
    private val properties: FetcherProperties,
    private val wc: WebClient,
) {
    @GetMapping("/{lang}")
    @Cacheable("externalApi", key = "#lang") // TODO: move to service
    fun fetchAllData(
        @PathVariable lang: String,
    ): ResponseEntity<Map<String, ExternalStudent>> {
        val language = Language.fromString(lang) ?: return ResponseEntity.notFound().build()
        val url = properties.urlTemplate.replace("{{language}}", language.code)
        val response =
            wc
                .get()
                .uri(url)
                .retrieve()
                .bodyToMono(object : ParameterizedTypeReference<Map<String, ExternalStudent>>() {})
                .block() ?: return ResponseEntity.ok(emptyMap())

        val topk = response.entries.take(10).associate { it.key to it.value }
        return ResponseEntity.ok(topk)
    }

    @PostMapping("/{lang}")
    @Cacheable("externalApi", key = "#lang") // TODO: move to service
    fun fetchAndSaveAllData(
        @PathVariable lang: String,
    ): ResponseEntity<Any> {
        val language = Language.fromString(lang) ?: return ResponseEntity.notFound().build()
        val url = properties.urlTemplate.replace("{{language}}", language.code)
        val response =
            wc
                .get()
                .uri(url)
                .retrieve()
                .bodyToMono(object : ParameterizedTypeReference<Map<String, ExternalStudent>>() {})
                .block() ?: return ResponseEntity.notFound().build()

        // Logic
        // 1. find corresponding image. base image dir must be given
        // 2. save to db with image path

        // TODO: Fix location, use normal student api, not grouped
        val location = URI.create("/api/v1/students/grouped/$language")
        return ResponseEntity.created(location).build()
    }
}
