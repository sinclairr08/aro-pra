package com.aropra.service

import com.aropra.dto.VersionResponse
import com.aropra.dto.toResponse
import com.aropra.repository.VersionRepository
import org.springframework.stereotype.Service

@Service
class VersionService(
    private val versionRepository: VersionRepository,
) {
    fun getAllVersions(): List<VersionResponse> =
        versionRepository.findAllByOrderByUpdatedAtDesc().map {
            it.toResponse()
        }
}
