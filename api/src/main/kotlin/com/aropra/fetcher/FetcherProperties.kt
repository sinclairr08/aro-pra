package com.aropra.fetcher

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "app.fetcher")
data class FetcherProperties(
    val urlTemplate: String,
)
