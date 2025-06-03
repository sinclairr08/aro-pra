package com.aropra.controller

import com.aropra.dto.LinkRequest
import com.aropra.dto.LinkResponse
import com.aropra.service.LinkService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/links")
@CrossOrigin(origins = ["*"])
class LinkController(
    private val linkService: LinkService,
) {
    @GetMapping
    fun getAllLinks(): ResponseEntity<List<LinkResponse>> {
        val links = linkService.getAllLinks()
        return ResponseEntity.ok(links)
    }

    @PostMapping
    fun createLink(
        @RequestBody linkRequest: LinkRequest,
    ): ResponseEntity<LinkResponse> {
        val linkResponse = linkService.createLink(linkRequest)
        return ResponseEntity.ok(linkResponse)
    }
}
