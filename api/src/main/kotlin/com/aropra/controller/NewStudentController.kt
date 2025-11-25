@file:Suppress("ktlint:standard:no-wildcard-imports")

package com.aropra.controller

import com.aropra.converter.toNewStudent
import com.aropra.domain.ExternalStudent
import com.aropra.enum.Language
import com.aropra.service.NewStudentService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.net.URI

@RestController
@RequestMapping("/api/v1/new-students") // TODO: rename this
class NewStudentController(
    private val newStudentService: NewStudentService,
) {
    @PostMapping("/{lang}")
    fun fetchAndSaveAllStudents(
        @PathVariable lang: String,
    ): ResponseEntity<Any> {
        val language = Language.fromString(lang) ?: return ResponseEntity.notFound().build()
        val response =
            newStudentService.getStudentFromExternalSource(language) ?: return ResponseEntity
                .status(
                    HttpStatus.BAD_GATEWAY,
                ).build()
        val externalStudents = response.values.toList()
        val skippedStudents = mutableListOf<ExternalStudent>()
        val newStudents =
            externalStudents
                .mapNotNull { value ->
                    val imgCode = newStudentService.getStudentImgCode(value)
                    if (imgCode == null) {
                        skippedStudents += value
                        null
                    } else {
                        value.toNewStudent(imgCode = imgCode, language = language)
                    }
                }

        if (skippedStudents.isNotEmpty()) {
            val errBody =
                mapOf("students" to skippedStudents.map { it -> mapOf("devName" to it.devName, "name" to it.name) })
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errBody)
        }
        // TODO: ADD LOGGING
        newStudentService.createNewStudents(newStudents, language)
        val location = URI.create("/api/v1/new-students/$lang")
        return ResponseEntity.created(location).build()
    }

    @GetMapping("/{lang}")
    fun fetchAllStudents(
        @PathVariable lang: String,
    ): ResponseEntity<Any> {
        val language = Language.fromString(lang) ?: return ResponseEntity.notFound().build()
        val newStudents = newStudentService.getAllStudents(language)
        return ResponseEntity.ok(newStudents)
    }
}
