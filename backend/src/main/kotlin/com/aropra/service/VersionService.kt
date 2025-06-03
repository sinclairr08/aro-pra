package com.aropra.service

import com.aropra.converter.toVersion
import com.aropra.converter.toVersionResponse
import com.aropra.dto.VersionRequest
import com.aropra.dto.VersionResponse
import com.aropra.repository.VersionRepository
import org.springframework.stereotype.Service

@Service
class VersionService(
    private val versionRepository: VersionRepository,
) {
    fun getAllVersions(): List<VersionResponse> =
        versionRepository.findAllByOrderByUpdatedDateDesc().map {
            it.toVersionResponse()
        }

    fun createVersion(versionRequest: VersionRequest): VersionResponse {
        val version = versionRequest.toVersion()
        return versionRepository.save(version).toVersionResponse()
    }
}
