import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Create a Google Calendar event when booking is confirmed
export async function createCalendarEvent(
  googleTokens: string,
  booking: {
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    guestEmail: string;
    guestName: string;
    timezone: string;
  }
) {
  try {
    oauth2Client.setCredentials(JSON.parse(googleTokens));
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const event = {
      summary: booking.title,
      start: {
        dateTime: `${booking.date}T${booking.startTime}:00`,
        timeZone: booking.timezone,
      },
      end: {
        dateTime: `${booking.date}T${booking.endTime}:00`,
        timeZone: booking.timezone,
      },
      attendees: [{ email: booking.guestEmail, displayName: booking.guestName }],
      conferenceData: {
        createRequest: { requestId: Math.random().toString(36) },
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
      conferenceDataVersion: 1,
    });

    return response.data.hangoutLink; // Google Meet link
  } catch (error) {
    console.error("Google Calendar error:", error);
    return null;
  }
}