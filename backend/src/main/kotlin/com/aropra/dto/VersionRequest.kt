package com.aropra.dto

import com.aropra.domain.Version
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

data class VersionRequest(
    val version: String,
    val description: List<String>,
    val updatedDate: String? = null,
)

fun VersionRequest.toEntity(): Version =
    Version(
        version = this.version,
        description = this.description,
        updatedDate = this.updatedDate ?: LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")),
    )
