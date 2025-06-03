package com.aropra.controller

import com.aropra.dto.VersionRequest
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
        @RequestBody versionRequest: VersionRequest,
    ): ResponseEntity<VersionResponse> {
        val versionResponse = versionService.createVersion(versionRequest)
        return ResponseEntity.ok(versionResponse)
    }
}
