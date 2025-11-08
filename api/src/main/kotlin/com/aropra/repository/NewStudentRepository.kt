package com.aropra.repository

import com.aropra.domain.NewStudent
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface NewStudentRepository : MongoRepository<NewStudent, String>
