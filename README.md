## ShortURL

A clean, fast, and reliable URL shortening platform built with Java Spring Boot.

## Live Link https://shorturl-nhsu.onrender.com/

# Overview
  ![Dahboard](assets/home.png)


ShortURL is a modern web application that allows users to quickly shorten long URLs, generate QR codes, manage link history, and access shortened links instantly. The system is designed with a clean UI, efficient backend logic, and a scalable architecture suitable for production-grade use.

The project is built using Java Spring Boot on the backend, combined with a lightweight and responsive vanilla JavaScript frontend. ShortURL aims to provide a simple yet powerful alternative to existing commercial URL shorteners.

# Purpose

The primary purpose of ShortURL is to provide:

• A fast and reliable solution for generating short URLs
• A system where users can manage link history without logging in
• A fully client-side UI with smooth interaction
• A backend designed around clean APIs and modular logic
• A foundation to scale into analytics, branded links, and authentication

# Key Features
URL Shortening

• Converts any valid URL (supports HTTP/HTTPS) into a short, shareable link
• Uses hashing logic to generate unique identifiers
• Ensures collision prevention through database checks

QR Code Generation

• Instantly generates a QR code for any shortened link
• Users can save or scan the QR directly

Local URL History

• Automatically stores user history in the browser
• No login required
• Users can copy, visit, or delete history entries

Modern & Responsive UI

• Clean layout with white and dark theme elements
• Professional typography and spacing
• Fully mobile-friendly

Authentication UI (Frontend Only)

• Sign In and Sign Up modals included
• Placeholder for real backend authentication
• Smooth transitions and glass-effect design

Error Handling

• Invalid URL checks
• Clear messages for network issues
• Backend validation for malformed input

# Tech Stack
Backend

• Java 17
• Spring Boot
• Spring Web
• Spring Validation
• REST API Architecture
• URL Encoding and Hashing
• Spring Boot DevTools (optional)

# Frontend

• HTML5
• CSS3
• Vanilla JavaScript
• QRCode.js (CDN)

# Database

• In-memory or persistent DB depending on configuration
• Common choices: H2, MySQL, PostgreSQL
• ShortURL typically uses a table such as:

id | original_url | short_code | created_at

# System Architecture
High-Level Flow

User enters a long URL in the form

Frontend sends POST request to /api/shorten

Spring Boot receives request and:

Validates URL

Generates a short code using hashing logic

Saves mapping to the database

Returns the full short URL

Frontend displays short URL and provides copy/QR/share options

Optional: When accessing the short URL, the backend redirects to the original link

Core Algorithm and Business Logic
URL Validation

The backend checks:
• Whether the URL starts with http or https
• Whether the URL is syntactically valid
• Whether it contains restricted patterns

Short Code Generation

Typically implemented using one of the following:
• Hashing (MD5/SHA-256) + substring
• Base62 encoding
• Randomized token generation

# Example logic:

hash = SHA-256(longUrl)
shortCode = first 8 characters of Base62(hash)

Collision Handling

If a generated short code already exists:
• A new code is generated
• Or collisions are avoided by storing hash references

Redirection Logic

GET request to /s/{code} performs:
• Lookup short code in database
• If found, returns HTTP 302 redirect to original URL
• If not found, returns 404

Browser History Logic (Frontend)

Stored with localStorage:

{
  original: "https://example.com",
  short: "https://domain/s/abc123",
  when: "2025-02-12T14:23:00Z"
}

API Documentation
1. Shorten URL

POST /api/shorten

Request Body
{
  "url": "https://example.com/page"
}

Response
{
  "shortUrl": "https://yourdomain/s/abc123"
}

2. Redirect

GET /s/{code}

Redirects to original URL.

Installation and Setup
1. Clone the Repository
git clone https://github.com/your-repo/ShortURL.git
cd ShortURL

2. Build and Run (Spring Boot)
mvn clean install
mvn spring-boot:run

3. Access Application
http://localhost:8080

Project Structure
src/main/java/com.shorturl
    |-- controller
    |-- service
    |-- repository
    |-- model
    |-- ShortUrlApplication.java

src/main/resources/static
    |-- index.html
    |-- styles.css
    |-- app.js

Frontend Functionality
Shortening UI

• Input field
• Shorten button
• Result panel
• Action buttons (Visit, Copy, Share, QR)

History UI

• Opens modal showing list of shortened URLs
• Allows delete and copy actions
• Stored entirely on client-side

QR Modal

• Instantly shows QR code
• Works even without internet

Outcome

ShortURL demonstrates how a lightweight and scalable URL shortening system can be built with:

• Clean backend separation
• Efficient hashing-based short code generation
• Modern, user-friendly interface
• Browser-side state management
• Extendable architecture

It can serve as a foundation for:
• Link analytics
• User authentication
• Link expiration
• Branded domains
• Team link management

Future Enhancements

• User accounts and login
• Link analytics (clicks, geo, referrer)
• Expiring links
• Custom aliases
• Branded domains
• Admin dashboard

## Developed By

Vansh Pratap Singh
LinkedIn: https://linkedin.com/in/itsme-vansh
