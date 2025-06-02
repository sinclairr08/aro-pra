package com.aropra.service

import com.aropra.converter.toLink
import com.aropra.converter.toLinkResponse
import com.aropra.dto.LinkRequest
import com.aropra.dto.LinkResponse
import com.aropra.repository.LinkRepository
import org.springframework.stereotype.Service

@Service
class LinkService(
    private val linkRepository: LinkRepository,
) {
    fun getAllLinks(): List<LinkResponse> =
        linkRepository.findAll().map {
            it.toLinkResponse()
        }

    fun createLink(linkRequest: LinkRequest): LinkResponse {
        val link = linkRequest.toLink()
        return linkRepository.save(link).toLinkResponse()
    }
}
