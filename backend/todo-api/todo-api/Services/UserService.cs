using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using todo_api.Data;
using todo_api.Models;
using todo_api.Settings;

namespace todo_api.Services;

public class UserService 
{
    private readonly TodoContext _context;
    private readonly JwtSettings _jwtSettings;
    private readonly ILogger<UserService> _logger;

    public UserService(TodoContext context, IOptions<JwtSettings> jwtSettings, ILogger<UserService> logger)
    {
        _context = context;
        _jwtSettings = jwtSettings.Value; 
        _logger = logger;

        // Log the secret being used
        _logger.LogInformation($"JWT Secret in UserService: {_jwtSettings.Secret}");
    }
    
    public string GenerateJwtToken(User user)
    {
        var secretKey = Encoding.UTF8.GetBytes(_jwtSettings.Secret);  
        var issuer = _jwtSettings.Issuer; 
        var audience = _jwtSettings.Audience;  
        var expirationMinutes = _jwtSettings.ExpirationMinutes;  

        var signingCredentials = new SigningCredentials(
            new SymmetricSecurityKey(secretKey),
            SecurityAlgorithms.HmacSha256);

        var tokenHandler = new JwtSecurityTokenHandler();

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[] 
            {
                new Claim(ClaimTypes.Name, user.Username), // Add username as claim
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()) // Add user ID as claim
            }),
            Expires = DateTime.UtcNow.AddMinutes(expirationMinutes),  // Set expiration time using the settings
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = signingCredentials
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }

    // Register User
    public async Task<User> RegisterUser(string email, string password, string username)
    {
        // Validate inputs
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password) || string.IsNullOrWhiteSpace(username))
        {
            throw new ArgumentException("Email, password, and username must not be empty.");
        }

        // Check if the user already exists based on email
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email);

        if (existingUser != null)
        {
            throw new InvalidOperationException("User with the same email already exists.");
        }

        // Hash the password using BCrypt
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(password);

        // Create a new user instance
        var user = new User
        {
            Username = username,
            PasswordHash = passwordHash,
            Email = email
        };

        // Save the user to the database
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return user; 
    } 
    
    // Login User
    public async Task<string?> LoginUser(string email, string password)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
        {
            return null; // Invalid credentials
        }

        // Generate JWT
        return GenerateJwtToken(user);
    }

}