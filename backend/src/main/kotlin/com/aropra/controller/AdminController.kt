package com.aropra.controller

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseCookie
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Component
import org.springframework.web.bind.annotation.*
import java.security.Key
import java.time.Duration
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

    fun validateToken(token: String): Boolean =
        try {
            Jwts
                .parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
            true
        } catch (e: Exception) {
            false
        }
}

data class LoginRequest(
    val password: String,
)

data class LoginResponse(
    val success: Boolean,
)

@RestController
@RequestMapping("/api/v1/admin")
class AdminController(
    private val jwtUtils: JwtUtils,
) {
    @Value("\${app.admin.password}")
    private lateinit var adminPassword: String

    @Value("\${app.cookie.secure:false}")
    private var cookieSecure: Boolean = false

    @PostMapping("/login")
    fun login(
        @RequestBody request: LoginRequest,
    ): ResponseEntity<LoginResponse> {
        if (adminPassword == request.password) {
            val token = jwtUtils.generateToken()
            val cookie =
                ResponseCookie
                    .from("adminToken", token)
                    .httpOnly(true)
                    .secure(cookieSecure)
                    .path("/admin")
                    .maxAge(Duration.ofDays(1))
                    .build()

            return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body(LoginResponse(true))
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(LoginResponse(false))
    }

    @PostMapping("/logout")
    fun logout(): ResponseEntity<LoginResponse> {
        val cookie =
            ResponseCookie
                .from("adminToken", "")
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/admin")
                .maxAge(Duration.ZERO)
                .build()

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body(LoginResponse(true))
    }

    @GetMapping("/profile")
    fun getProfile(
        @CookieValue(name = "adminToken", required = false) token: String?,
    ): ResponseEntity<LoginResponse> {
        if (token != null && jwtUtils.validateToken(token)) {
            return ResponseEntity.ok(LoginResponse(success = true))
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(LoginResponse(false))
    }
}
