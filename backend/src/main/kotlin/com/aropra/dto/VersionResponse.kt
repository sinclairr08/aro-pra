package com.aropra.dto

import com.aropra.domain.Version
import java.time.format.DateTimeFormatter

data class VersionResponse(
    val id: String,
    val version: String,
    val description: List<String>,
    val updatedDate: String,
    val createdAt: String,
)

fun Version.toResponse(): VersionResponse =
    VersionResponse(
        id = this.id!!,
        version = this.version,
        description = this.description,
        updatedDate = this.updatedDate,
        createdAt = this.createdAt.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
    )
