package com.aropra.repository

import com.aropra.domain.Version
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface VersionRepository : MongoRepository<Version, String> {
    fun findAllByOrderByUpdatedDateDesc(): List<Version>
}
