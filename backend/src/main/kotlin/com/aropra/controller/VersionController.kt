package com.aropra.controller

import com.aropra.domain.Version
import com.aropra.dto.VersionResponse
import com.aropra.service.VersionService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/versions")
@CrossOrigin(origins = ["*"])
class VersionController(
    private val versionService: VersionService,
) {
    @GetMapping
    fun getAllVersions(): ResponseEntity<List<VersionResponse>> {
        val versions = versionService.getAllVersions()
        return ResponseEntity.ok(versions)
    }

    @PostMapping
    fun createVersion(
        @RequestBody version: Version,
    ): ResponseEntity<VersionResponse> {
        val versionResponse = versionService.createVersion(version)
        return ResponseEntity.ok(versionResponse)
    }
}
