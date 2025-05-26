package com.aropra.dto

import com.aropra.domain.Version
import java.time.format.DateTimeFormatter

data class VersionResponse(
    val id: Long,
    val version: String,
    val updatedAt: String,
    val description: List<String>,
)

fun Version.toResponse(): VersionResponse =
    VersionResponse(
        id = this.id,
        version = this.version,
        updatedAt = this.updatedAt.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
        description = this.description,
    )
