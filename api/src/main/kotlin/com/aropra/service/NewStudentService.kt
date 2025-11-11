package com.aropra.service

import com.aropra.config.NewStudentProperties
import com.aropra.converter.toNewStudent
import com.aropra.domain.ExternalStudent
import com.aropra.domain.NewStudent
import com.aropra.enum.Language
import com.aropra.repository.NewStudentRepository
import com.aropra.repository.StudentImgCodeRepository
import org.springframework.cache.annotation.Cacheable
import org.springframework.core.ParameterizedTypeReference
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.reactive.function.client.WebClient

@Service
class NewStudentService(
    private val newStudentRepository: NewStudentRepository,
    private val studentImgCodeRepository: StudentImgCodeRepository,
    private val wc: WebClient,
    private val properties: NewStudentProperties,
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

    fun mapStudentCode(externalStudent: ExternalStudent): NewStudent? {
        val devImgCode = studentImgCodeRepository.findByCode(externalStudent.devName)

        if (devImgCode != null) {
            return externalStudent.toNewStudent(devImgCode.code)
        }

        val nameImgCode = studentImgCodeRepository.findByCode(externalStudent.name)

        if (nameImgCode != null) {
            return externalStudent.toNewStudent(nameImgCode.code)
        }

        return null
    }
}
