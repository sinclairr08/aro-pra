package com.aropra.config

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "app.external")
data class ExternalApiProperties(
    val urlTemplate: String,
)
