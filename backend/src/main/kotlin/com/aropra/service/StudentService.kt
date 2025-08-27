package com.aropra.service

import com.aropra.converter.toStudentData
import com.aropra.dto.GroupedStudentResponse
import com.aropra.repository.StudentRepository
import org.springframework.stereotype.Service

@Service
class StudentService(
    private val studentRepository: StudentRepository,
) {
    fun getGroupedByKrBaseName(): List<GroupedStudentResponse> =
        studentRepository
            .findAll()
            .groupBy { it.krBaseName }
            .map { (name, students) ->
                GroupedStudentResponse(
                    name = name,
                    value = students.map { it.toStudentData() },
                )
            }
}
