package com.aropra.service

import com.aropra.domain.Link
import com.aropra.dto.LinkResponse
import com.aropra.dto.toResponse
import com.aropra.repository.LinkRepository
import org.springframework.stereotype.Service

@Service
class LinkService(
    private val linkRepository: LinkRepository,
) {
    fun getAllLinks(): List<LinkResponse> =
        linkRepository.findAll().map {
            it.toResponse()
        }

    fun createLink(link: Link): LinkResponse = linkRepository.save(link).toResponse()
}
