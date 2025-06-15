package com.aropra.controller

import org.springframework.web.bind.annotation.*

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
}
