@file:Suppress("ktlint:standard:no-wildcard-imports")

package com.aropra.controller

import com.aropra.converter.toNewStudent
import com.aropra.enum.Language
import com.aropra.service.NewStudentService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.net.URI

@RestController
@RequestMapping("/api/v1/new-student") // TODO: rename this
class NewStudentController(
    private val newStudentService: NewStudentService,
) {
    @PostMapping("/{lang}")
    fun fetchAndSaveAllData(
        @PathVariable lang: String,
    ): ResponseEntity<Any> {
        val language = Language.fromString(lang) ?: return ResponseEntity.notFound().build()
        val response =
            newStudentService.getStudentFromExternalSource(language) ?: return ResponseEntity
                .status(
                    HttpStatus.BAD_GATEWAY,
                ).build()
        val values = response.values.toList()
        val newStudents =
            values
                .mapNotNull { value ->
                    val path = newStudentService.getStudentPath(value)
                    if (path != null) value.toNewStudent(path) else null
                }

        // TODO: ADD LOGGING
        val saved = newStudentService.createNewStudents(newStudents)
        val location = URI.create("/api/v1/new-students/$lang")
        return ResponseEntity.created(location).build()
    }
}
