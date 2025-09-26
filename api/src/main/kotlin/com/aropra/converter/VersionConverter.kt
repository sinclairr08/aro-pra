package com.aropra.converter

import com.aropra.domain.Version
import com.aropra.dto.VersionRequest
import com.aropra.dto.VersionResponse
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

fun Version.toVersionResponse(): VersionResponse =
    VersionResponse(
        id = this.id!!,
        version = this.version,
        description = this.description,
        updatedDate = this.updatedDate,
    )

fun VersionRequest.toVersion(): Version =
    Version(
        version = this.version,
        description = this.description,
        updatedDate = this.updatedDate ?: LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")),
    )
