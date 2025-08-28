package com.aropra.controller

import com.aropra.dto.GroupedStudentResponse
import com.aropra.enum.Language
import com.aropra.service.StudentService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/students")
class StudentController(
    private val studentService: StudentService,
) {
    @GetMapping("/grouped/{lang}")
    fun getGroupedStudents(
        @PathVariable lang: String,
    ): ResponseEntity<List<GroupedStudentResponse>> {
        val language = Language.fromstring(lang) ?: return ResponseEntity.notFound().build()
        val groupedStudents = studentService.getGroupedByBaseName(language)
        return ResponseEntity.ok(groupedStudents)
    }
}
