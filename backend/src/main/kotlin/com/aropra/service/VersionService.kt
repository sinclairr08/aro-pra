package com.aropra.service

import com.aropra.dto.VersionRequest
import com.aropra.dto.VersionResponse
import com.aropra.dto.toEntity
import com.aropra.dto.toResponse
import com.aropra.repository.VersionRepository
import org.springframework.stereotype.Service

@Service
class VersionService(
    private val versionRepository: VersionRepository,
) {
    fun getAllVersions(): List<VersionResponse> =
        versionRepository.findAllByOrderByCreatedAtDesc().map {
            it.toResponse()
        }

    fun createVersion(versionRequest: VersionRequest): VersionResponse {
        val version = versionRequest.toEntity()
        return versionRepository.save(version).toResponse()
    }
}
