package com.aropra.service

import com.aropra.config.NewStudentProperties
import com.aropra.converter.toStudentOutfit
import com.aropra.domain.ExternalStudent
import com.aropra.domain.NewStudent
import com.aropra.dto.NewStudentResponse
import com.aropra.enum.Language
import com.aropra.repository.NewStudentRepository
import com.aropra.repository.StudentImgCodeRepository
import org.springframework.cache.annotation.Cacheable
import org.springframework.core.ParameterizedTypeReference
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.reactive.function.client.WebClient

@Service
open class NewStudentService(
    private val newStudentRepository: NewStudentRepository,
    private val studentImgCodeRepository: StudentImgCodeRepository,
    private val wc: WebClient,
    private val properties: NewStudentProperties,
) {
    @Transactional
    open fun createNewStudents(
        newStudents: List<NewStudent>,
        language: Language,
    ): List<NewStudent> {
        if (newStudents.isEmpty()) return newStudents

        // 이름에 *가 있는 경우만 예외적으로 변경
        val processedStudents =
            newStudents.map { student ->
                if ("*" in student.name) {
                    student.copy(personalName = student.name)
                } else {
                    student
                }
            }
        return newStudentRepository.saveAll(processedStudents).toList()
    }

    fun getAllStudents(language: Language): List<NewStudent> = newStudentRepository.findByLanguage(language)

    @Cacheable("externalApi", key = "#language")
    open fun getStudentFromExternalSource(language: Language): Map<String, ExternalStudent>? {
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

    private val special: Map<String, String> =
        mapOf(
            "CH0134" to "reizyo",
            "CH0065" to "shiroko_ridingsuit",
        )

    fun getStudentImgCode(externalStudent: ExternalStudent): String? {
        val devImgCode = studentImgCodeRepository.findByCode(externalStudent.devName.lowercase())

        if (devImgCode != null) {
            return devImgCode.code
        }

        val nameImgCode = studentImgCodeRepository.findByCode(externalStudent.pathName.lowercase())

        if (nameImgCode != null) {
            return nameImgCode.code
        }

        val specialName = special[externalStudent.devName]

        if (specialName != null) {
            val specialImgCode = studentImgCodeRepository.findByCode(specialName.lowercase())
            if (specialImgCode != null) {
                return specialImgCode.code
            }
        }

        return null
    }

    fun getGroupedByBaseName(language: Language): List<NewStudentResponse> =
        newStudentRepository
            .findByLanguage(language)
            .groupBy { it.personalName }
            .map { (name, students) ->
                NewStudentResponse(
                    name = name,
                    outfits = students.map { it.toStudentOutfit() },
                    currentOutfitCode = students.minBy { it.name.length }.imgCode,
                )
            }
}
