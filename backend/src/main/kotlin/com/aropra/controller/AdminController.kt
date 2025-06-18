package com.aropra.controller

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import org.springframework.web.bind.annotation.*
import java.security.Key
import java.util.*

@Component
class JwtUtils {
    @Value("\${app.jwt.secret}")
    private lateinit var jwtSecret: String

    @Value("\${app.jwt.expiration-ms}")
    private var jwtExpiration: Long = 86400000L

    private val key: Key by lazy {
        Keys.hmacShaKeyFor(jwtSecret.toByteArray())
    }

    fun generateToken(): String =
        Jwts
            .builder()
            .setSubject("admin")
            .setIssuedAt(Date())
            .setExpiration(Date(Date().time + jwtExpiration))
            .signWith(key, SignatureAlgorithm.HS512)
            .compact()
}

data class LoginRequest(
    val password: String,
)

data class LoginResponse(
    val success: Boolean,
)

@RestController
@RequestMapping("/api/v1/admin")
@CrossOrigin(origins = ["*"])
class AdminController {
    private val adminPassword = "test123"

    @PostMapping("/login")
    fun login(
        @RequestBody request: LoginRequest,
    ): LoginResponse = LoginResponse(success = adminPassword == request.password)

    @GetMapping("/verify")
    fun verify(
        @RequestHeader("Authorization") authorization: String?,
    ): LoginResponse {
        val token = authorization?.removePrefix("Bearer ")

        return LoginResponse(success = token != null)
    }
}
