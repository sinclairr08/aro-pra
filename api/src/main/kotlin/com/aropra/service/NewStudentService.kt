package com.aropra.service

import com.aropra.domain.NewStudent
import com.aropra.repository.NewStudentRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class NewStudentService(
    private val newStudentRepository: NewStudentRepository,
) {
    @Transactional
    fun createNewStudents(newStudents: List<NewStudent>): List<NewStudent> {
        if (newStudents.isEmpty()) return newStudents
        return newStudentRepository.saveAll(newStudents).toList()
    }
}
