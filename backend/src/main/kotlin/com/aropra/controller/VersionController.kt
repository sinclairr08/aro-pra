package com.aropra.controller

import com.aropra.service.VersionResponse
import com.aropra.service.VersionService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

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
}
