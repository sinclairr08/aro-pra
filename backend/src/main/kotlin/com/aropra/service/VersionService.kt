package com.aropra.service

import com.aropra.domain.Version
import com.aropra.repository.VersionRepository
import org.springframework.stereotype.Service
import java.time.format.DateTimeFormatter

@Service
class VersionService(
    private val versionRepository: VersionRepository,
) {
    fun getAllVersions(): List<VersionResponse> =
        versionRepository.findAllByOrderByUpdatedAtDesc().map {
            it.toResponse()
        }

    private fun Version.toResponse(): VersionResponse =
        VersionResponse(
            id = this.id,
            version = this.version,
            updatedAt = this.updatedAt.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
            description = this.description,
        )
}

data class VersionResponse(
    val id: Long,
    val version: String,
    val updatedAt: String,
    val description: List<String>,
)
