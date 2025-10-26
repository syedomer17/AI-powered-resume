# AI-Powered Job Application System

## Overview
Automatic job application system with two powerful features:
1. **Send to HR**: Automatically email your resume to 100 HR contacts
2. **Auto Apply**: Automatically apply to multiple selected jobs

---

## Features Implemented

### ✅ 1. Send Resume to HR
- **Email 100 HR contacts** automatically
- **Customizable job title** for email subject
- **Adjustable HR count** (10-100 contacts)
- **Progress bar** showing real-time sending status
- **Results dashboard** showing sent/failed counts
- **Demo mode** for testing without email credentials

### ✅ 2. Auto Apply to Jobs
- **Select multiple jobs** for batch application
- **One-click auto-apply** to all selected positions
- **Progress tracking** with visual feedback
- **Detailed results** for each application
- **Success rate** displayed (90% mock success rate)
- **Job details** shown in results

---

## Files Created

### Backend APIs

1. **`/app/api/jobs/send-to-hr/route.ts`**
   - POST: Send resume to HR contacts
   - GET: Check HR status and email configuration
   - Features:
     - Session authentication
     - Database integration for user/resume lookup
     - Bulk email sending with rate limiting
     - Progress tracking
     - Error handling

2. **`/app/api/jobs/auto-apply/route.ts`**
   - POST: Auto-apply to multiple jobs
   - GET: Check auto-apply status
   - Features:
     - Mock application process (90% success rate)
     - Batch processing with progress updates
     - Application history tracking
     - Detailed results per job

### Data Layer

3. **`/data/hrEmails.ts`**
   - 100 mock HR email addresses
   - Helper functions:
     - `getAllHREmails()`: Get all 100 emails
     - `getRandomHREmails(count)`: Get random subset
     - `getTotalHRCount()`: Get total count

### Email Configuration

4. **`/lib/emailConfig.ts`**
   - Nodemailer setup and configuration
   - Email functions:
     - `createEmailTransporter()`: SMTP setup
     - `sendEmail()`: Send single email
     - `sendBulkEmails()`: Batch sending with progress
     - `generateJobApplicationEmail()`: HTML template
   - Features:
     - Rate limiting (200ms between emails)
     - Demo mode when credentials not configured
     - Professional HTML email templates
     - Attachment support for resume PDFs

### Frontend Components

5. **`/components/custom/SendToHR.tsx`**
   - UI for sending resume to HR
   - Features:
     - Job title input
     - HR count slider (10-100)
     - Real-time progress bar
     - Results cards (sent/failed/total)
     - Demo mode notice
     - Responsive design

6. **`/components/custom/AutoApply.tsx`**
   - UI for auto-applying to jobs
   - Features:
     - Selected jobs summary
     - Progress bar during application
     - Results list with status icons
     - Link to original job posting
     - Success/failure breakdown
     - Demo mode notice

7. **`/components/ui/progress.tsx`**
   - Radix UI Progress component
   - Used in both SendToHR and AutoApply

### Integration

8. **Updated `/components/custom/JobSearch.tsx`**
   - Added action buttons bar
   - Job selection checkboxes
   - "Select All" functionality
   - Modal dialogs for SendToHR and AutoApply
   - Integrated both new components

9. **Updated `/app/dashboard/jobs/[userId]/page.tsx`**
   - Passes resumeId to JobSearch component
   - Uses first resume by default

---

## Usage

### 1. Send Resume to HR

1. Navigate to **Dashboard → Find Jobs**
2. Click **"Send to HR"** button
3. Enter job title (e.g., "Software Developer")
4. Adjust HR count slider (10-100)
5. Click **"Send to X HRs"**
6. Watch progress bar
7. View results (sent/failed counts)

### 2. Auto Apply to Jobs

1. Navigate to **Dashboard → Find Jobs**
2. Search for jobs
3. **Check the boxes** next to jobs you want to apply to
4. Click **"Auto Apply"** button
5. Review selected jobs in modal
6. Click **"Auto Apply to X Jobs"**
7. Watch progress and see results

### 3. Bulk Actions

- **Select All**: Click to select all visible jobs
- **Clear**: Clear all selections
- **Selected count**: Shows X jobs selected

---

## Configuration

### Email Setup (Optional)

Add to your `.env` file:

```env
# Email Configuration for Send to HR
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# Optional: App URL for resume links
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Note:** Without email credentials, the system runs in **demo mode** and simulates sending.

### Gmail Setup

1. Enable 2-Factor Authentication
2. Generate an App Password:
   - Go to Google Account → Security
   - App Passwords
   - Select "Mail" and your device
   - Copy the generated password
3. Use App Password as `EMAIL_PASSWORD`

---

## API Endpoints

### POST `/api/jobs/send-to-hr`

Send resume to HR contacts.

**Request Body:**
```json
{
  "resumeId": "resume_id_here",
  "jobTitle": "Software Developer",
  "hrCount": 50
}
```

**Response:**
```json
{
  "success": true,
  "message": "Resume sent to 50 HR contacts",
  "data": {
    "sent": 50,
    "failed": 0,
    "total": 50,
    "candidateName": "John Doe",
    "jobTitle": "Software Developer"
  }
}
```

### GET `/api/jobs/send-to-hr`

Get HR sending status.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalHRContacts": 100,
    "emailConfigured": false,
    "demoMode": true
  }
}
```

### POST `/api/jobs/auto-apply`

Auto-apply to multiple jobs.

**Request Body:**
```json
{
  "jobIds": ["job1", "job2", "job3"],
  "resumeId": "resume_id_here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Applied to 3 out of 3 jobs",
  "data": {
    "total": 3,
    "successful": 3,
    "failed": 0,
    "results": [
      {
        "jobId": "job1",
        "status": "success",
        "message": "Application submitted successfully",
        "appliedAt": "2025-10-25T12:00:00.000Z"
      }
    ]
  }
}
```

### GET `/api/jobs/auto-apply`

Get auto-apply status.

**Response:**
```json
{
  "success": true,
  "data": {
    "autoApplyEnabled": true,
    "message": "Auto-apply is a mock feature for demonstration purposes"
  }
}
```

---

## Dependencies Installed

```json
{
  "nodemailer": "^6.9.x",
  "@types/nodemailer": "^6.4.x",
  "@radix-ui/react-progress": "^1.0.x"
}
```

---

## Demo Mode vs Production

### Demo Mode (Default)
- ✅ Shows full UI/UX flow
- ✅ Simulates email sending (logs to console)
- ✅ Mock success rates (90%)
- ✅ Progress bars and results
- ❌ No actual emails sent
- ❌ No real job applications

### Production Mode
To enable production mode:
1. Configure `EMAIL_USER` and `EMAIL_PASSWORD` in `.env`
2. Integrate with real job application APIs
3. Add actual resume PDF generation
4. Implement real application submission

---

## Testing

### Test Send to HR
```bash
curl -X POST http://localhost:3000/api/jobs/send-to-hr \
  -H "Content-Type: application/json" \
  -d '{
    "resumeId": "YOUR_RESUME_ID",
    "jobTitle": "Software Engineer",
    "hrCount": 10
  }'
```

### Test Auto Apply
```bash
curl -X POST http://localhost:3000/api/jobs/auto-apply \
  -H "Content-Type: application/json" \
  -d '{
    "jobIds": ["job1", "job2"],
    "resumeId": "YOUR_RESUME_ID"
  }'
```

---

## UI/UX Features

### Visual Indicators
- 🟢 Success: Green checkmark icons
- 🔴 Failed: Red X icons
- 📧 Email: Mail icon for send to HR
- ⚡ Auto Apply: Lightning bolt icon
- ✅ Selection: Checkboxes on job cards
- 📊 Progress: Real-time progress bars

### Color Coding
- **Purple gradient**: Action buttons bar
- **Yellow**: Auto Apply button
- **Purple**: Send to HR button
- **Green**: Success states
- **Red**: Error states
- **Blue**: Information states

### Responsiveness
- Mobile-friendly layouts
- Scrollable results lists
- Responsive grid layouts
- Adaptive button sizes

---

## Future Enhancements

### Potential Additions:
1. **Resume Selection**: Let user choose which resume to send
2. **Email Templates**: Multiple email templates to choose from
3. **Schedule Sending**: Schedule bulk emails for optimal times
4. **Application Tracking**: Store application history in database
5. **Follow-up Emails**: Automatic follow-ups after X days
6. **LinkedIn Integration**: Real LinkedIn Easy Apply integration
7. **Indeed Integration**: Indeed Quick Apply integration
8. **Application Analytics**: Track response rates, interview requests
9. **Cover Letter Generation**: AI-generated cover letters per job
10. **Email Verification**: Verify HR emails before sending

---

## Troubleshooting

### Issue: Emails not sending
**Solution:** Check EMAIL_USER and EMAIL_PASSWORD in .env, restart server

### Issue: Gmail blocking emails
**Solution:** Use App Password, not regular password

### Issue: "Resume not found" error
**Solution:** Ensure user has at least one resume created

### Issue: Auto-apply showing 0 jobs
**Solution:** Select jobs by checking checkboxes first

### Issue: Progress bar stuck
**Solution:** Refresh page, check browser console for errors

---

## Security Considerations

### Implemented:
- ✅ Session authentication on all endpoints
- ✅ User verification before sending
- ✅ Resume ownership validation
- ✅ Rate limiting on bulk emails (200ms delay)
- ✅ Environment variable protection

### Recommendations:
- 🔒 Add CAPTCHA for bulk actions
- 🔒 Implement daily sending limits per user
- 🔒 Add email verification
- 🔒 Monitor for abuse/spam behavior
- 🔒 Encrypt stored email credentials

---

## Summary

### ✅ Deliverables Completed:
1. ✅ `/api/jobs/send-to-hr` endpoint with progress tracking
2. ✅ `/api/jobs/auto-apply` endpoint with mock applications
3. ✅ 100 HR emails in data/hrEmails.ts
4. ✅ Nodemailer integration with HTML templates
5. ✅ SendToHR component with progress bar
6. ✅ AutoApply component with results tracking
7. ✅ Job selection UI in JobSearch
8. ✅ Complete integration with job search page
9. ✅ Demo mode for testing without credentials
10. ✅ Professional UI/UX with modern design

### User Journey:
1. User searches for jobs → Results appear
2. User can either:
   - **Option A**: Click "Send to HR" → Email resume to 100 HRs
   - **Option B**: Select jobs → Click "Auto Apply" → Apply to selected jobs
3. Watch progress bar in real-time
4. See detailed results with success/failure counts
5. Review application history

**Feature is production-ready for demo purposes!** 🎉
