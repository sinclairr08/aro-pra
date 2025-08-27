package com.aropra.controller

import com.aropra.dto.GroupedStudentResponse
import com.aropra.service.StudentService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/students")
class StudentController(
    private val studentService: StudentService,
) {
    @GetMapping("/grouped/kr")
    fun getAllLinks(): ResponseEntity<List<GroupedStudentResponse>> {
        val groupedStudents = studentService.getGroupedByKrBaseName()
        return ResponseEntity.ok(groupedStudents)
    }
}
