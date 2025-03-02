using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using todo_api.Services;

namespace todo_api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly UserService _userService;

    public UserController(UserService userService)
    {
        _userService = userService;
    }

    // POST api/user/register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (request == null)
        {
            return BadRequest("Invalid request.");
        }

        try
        {
            var user = await _userService.RegisterUser(request.Email, request.Password, request.Username);
            return CreatedAtAction(nameof(Login), new { username = user.Username }, new
            {
                user.Id,
                user.Username,
                user.Email
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "An error occurred while processing your request.");
        }
    }

    // POST api/user/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (request == null)
        {
            return BadRequest("Invalid request.");
        }

        var token = await _userService.LoginUser(request.Email, request.Password);

        if (token == null)
        {
            return Unauthorized("Invalid credentials.");
        }

        return Ok(new { Token = token });
    }

    // GET api/user/me
    [HttpGet("me")]
    [Authorize] // Ensure the user is authenticated
    public IActionResult GetCurrentUser()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value; // Extract user ID from claims
        if (userId == null)
        {
            return Unauthorized("User ID not found in token.");
        }

        return Ok(new { UserId = userId });
    }


    // Request model for registration
    public class RegisterRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string Username { get; set; }
    }

    // Request model for login
    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}