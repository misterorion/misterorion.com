export default {
  async fetch(request, env) {
    const VALID_ENDPOINT = "/contact/";
    const MAX_CONTENT_LENGTH = 800;
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Helper functions
    const jsonResponse = (message, status = 200) =>
      new Response(JSON.stringify({ message }), {
        status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, x-frontend-auth",
        },
      });

    const validateRequest = async (request) => {
      // CORS preflight
      if (request.method === "OPTIONS") {
        return jsonResponse("ok", 200);
      }

      // Basic validations
      if (
        request.headers.get("x-frontend-auth") !== env.PUBLIC_FRONTEND_AUTH_KEY
      ) {
        throw new Error("Unauthorized");
      }

      if (request.method !== "POST") {
        throw new Error("Method not allowed");
      }

      if (new URL(request.url).pathname !== VALID_ENDPOINT) {
        throw new Error("Not found");
      }

      const contentLength = request.headers.get("content-length");
      if (contentLength && parseInt(contentLength) > MAX_CONTENT_LENGTH) {
        throw new Error("Content too large");
      }

      if (request.headers.get("content-type") !== "application/json") {
        throw new Error("Invalid content type");
      }
    };

    const validateData = (data) => {
      if (!data.name?.trim() || !data.email?.trim() || !data.comment?.trim()) {
        throw new Error("Missing required fields");
      }

      if (!EMAIL_REGEX.test(data.email)) {
        throw new Error("Invalid email format");
      }

      if (data.comment.length > 500) {
        throw new Error("Comment too long");
      }
    };

    const sendEmail = async (data) => {
      const MAILGUN_DOMAIN = "mg.mechapower.com";
      const MAILGUN_ENDPOINT = `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`;

      const sanitizedData = {
        name: data.name.trim(),
        email: data.email.trim(),
        comment: data.comment.trim(),
      };

      const formData = new FormData();
      formData.append("from", `Contact Form <contact@${MAILGUN_DOMAIN}>`);
      formData.append("to", "tech-admin@mechapower.com");
      formData.append(
        "subject",
        `New Contact Form Submission from ${sanitizedData.name}`
      );
      formData.append(
        "text",
        `Name: ${sanitizedData.name}\nEmail: ${sanitizedData.email}\n\nMessage:\n${sanitizedData.comment}`
      );
      formData.append(
        "html",
        `<p><strong>Name:</strong> ${sanitizedData.name}</p>
         <p><strong>Email:</strong> ${sanitizedData.email}</p>
         <p><strong>Message:</strong> ${sanitizedData.comment}</p>`
      );

      const response = await fetch(MAILGUN_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa("api:" + env.MAILGUN_API_KEY)}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Mailgun API error: ${error}`);
      }
    };

    try {
      await validateRequest(request);

      if (request.method === "OPTIONS") {
        return jsonResponse("ok", 200);
      }

      const data = await request.json();
      validateData(data);
      await sendEmail(data);

      return jsonResponse("Message sent successfully");
    } catch (error) {
      const status =
        {
          Unauthorized: 401,
          "Method not allowed": 405,
          "Not found": 404,
          "Content too large": 413,
          "Invalid content type": 400,
          "Missing required fields": 400,
          "Invalid email format": 400,
          "Comment too long": 400,
        }[error.message] || 500;

      return jsonResponse(error.message, status);
    }
  },
};
