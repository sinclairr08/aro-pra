package com.aropra.repository

import com.aropra.domain.Link
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface LinkRepository : MongoRepository<Link, String>
