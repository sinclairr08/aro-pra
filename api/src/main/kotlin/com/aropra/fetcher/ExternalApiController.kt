package com.aropra.fetcher

import com.aropra.enum.Language
import org.springframework.core.ParameterizedTypeReference
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.reactive.function.client.WebClient

@RestController
@RequestMapping("/api/v1/fetch")
class ExternalApiController(
    private val properties: FetcherProperties,
    private val wc: WebClient,
) {
    @GetMapping("/{lang}")
    fun fetchAndSaveAllData(
        @PathVariable lang: String,
    ): ResponseEntity<Map<String, Any>> {
        val language = Language.fromString(lang) ?: return ResponseEntity.notFound().build()
        val url = properties.urlTemplate.replace("{{language}}", language.code)
        val response =
            wc
                .get()
                .uri(url)
                .retrieve()
                .bodyToMono(object : ParameterizedTypeReference<Map<String, Any>>() {})
                .block() ?: return ResponseEntity.ok(emptyMap())

        val topk = response.entries.take(10).associate { it.key to it.value }
        return ResponseEntity.ok(topk)
    }
}
