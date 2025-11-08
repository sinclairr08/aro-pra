package com.aropra.service

import com.aropra.config.ExternalApiProperties
import com.aropra.domain.ExternalStudent
import com.aropra.domain.NewStudent
import com.aropra.enum.Language
import com.aropra.repository.NewStudentRepository
import org.springframework.cache.annotation.Cacheable
import org.springframework.core.ParameterizedTypeReference
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.reactive.function.client.WebClient

@Service
class NewStudentService(
    private val newStudentRepository: NewStudentRepository,
    private val wc: WebClient,
    private val properties: ExternalApiProperties,
) {
    @Transactional
    fun createNewStudents(newStudents: List<NewStudent>): List<NewStudent> {
        if (newStudents.isEmpty()) return newStudents
        return newStudentRepository.saveAll(newStudents).toList()
    }

    @Cacheable("externalApi", key = "#language")
    fun getStudentFromExternalSource(language: Language): Map<String, ExternalStudent>? {
        val url = properties.urlTemplate.replace("{{language}}", language.code)
        val response =
            wc
                .get()
                .uri(url)
                .retrieve()
                .bodyToMono(object : ParameterizedTypeReference<Map<String, ExternalStudent>>() {})
                .block()

        return response
    }
}
