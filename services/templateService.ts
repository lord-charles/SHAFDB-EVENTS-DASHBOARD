interface EmailTemplate {
  id: string
  name: string
  subject: string
  htmlContent: string
  category: string
  variables: string[]
  isDefault?: boolean
}

class TemplateService {
  private templates: EmailTemplate[] = [
    // Universal Standard Template - Most versatile for any scenario
    {
      id: "universal-standard",
      name: "Universal Standard Communication",
      subject: "{{subject}}",
      category: "standard",
      isDefault: true,
      variables: [
        "subject",
        "delegateName",
        "delegateTitle",
        "organization",
        "mainTitle",
        "mainMessage",
        "keyPoint1",
        "keyPoint2",
        "keyPoint3",
        "keyPoint4",
        "callToActionText",
        "callToActionUrl",
        "importantNote",
        "contactEmail",
        "eventYear",
      ],
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>{{subject}}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { background: linear-gradient(135deg, #059669 0%, #0d9488 100%); color: white; padding: 30px 20px; text-align: center; }
            .logo { width: 50px; height: 50px; background: rgba(255,255,255,0.2); border-radius: 12px; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
            .content { padding: 30px 20px; }
            .greeting { font-size: 18px; margin-bottom: 20px; color: #1f2937; }
            .main-message { font-size: 16px; margin-bottom: 25px; color: #4b5563; line-height: 1.7; }
            .key-points { background: #f0fdf4; border-left: 4px solid #059669; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0; }
            .key-points h3 { color: #059669; margin-top: 0; margin-bottom: 15px; font-size: 18px; }
            .key-points ul { margin: 0; padding-left: 20px; }
            .key-points li { margin-bottom: 8px; color: #374151; }
            .cta-section { text-align: center; margin: 30px 0; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #059669 0%, #0d9488 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3); transition: transform 0.2s; }
            .cta-button:hover { transform: translateY(-2px); }
            .important-note { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 25px 0; }
            .important-note strong { color: #92400e; }
            .footer { background: #f9fafb; padding: 25px 20px; text-align: center; border-top: 1px solid #e5e7eb; }
            .footer p { margin: 5px 0; color: #6b7280; font-size: 14px; }
            @media (max-width: 600px) {
              .container { margin: 0; }
              .header, .content, .footer { padding: 20px 15px; }
              .logo { width: 40px; height: 40px; font-size: 20px; }
              .greeting { font-size: 16px; }
              .main-message { font-size: 15px; }
              .cta-button { padding: 12px 24px; font-size: 15px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🏠</div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Shelter Afrique</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">Official Communication {{eventYear}}</p>
            </div>
            
            <div class="content">
              <div class="greeting">
                Dear {{delegateTitle}} {{delegateName}},<br>
                <span style="font-size: 14px; color: #6b7280;">{{organization}}</span>
              </div>
              
              <h2 style="color: #059669; margin-bottom: 20px; font-size: 22px;">{{mainTitle}}</h2>
              
              <div class="main-message">
                {{mainMessage}}
              </div>
              
              <div class="key-points">
                <h3>Key Highlights:</h3>
                <ul>
                  <li>{{keyPoint1}}</li>
                  <li>{{keyPoint2}}</li>
                  <li>{{keyPoint3}}</li>
                  <li>{{keyPoint4}}</li>
                </ul>
              </div>
              
              <div class="cta-section">
                <a href="{{callToActionUrl}}" class="cta-button">{{callToActionText}}</a>
              </div>
              
              <div class="important-note">
                <strong>Important:</strong> {{importantNote}}
              </div>
            </div>
            
            <div class="footer">
              <p><strong>Shelter Afrique</strong></p>
              <p>Email: {{contactEmail}} | Year: {{eventYear}}</p>
              <p style="font-size: 12px; margin-top: 15px;">This is an official communication from Shelter Afrique. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    },

    // Welcome Template
    {
      id: "welcome-delegate",
      name: "Welcome New Delegate",
      subject: "Welcome to {{eventName}} {{eventYear}} - {{delegateName}}",
      category: "welcome",
      isDefault: true,
      variables: [
        "delegateName",
        "delegateTitle",
        "organization",
        "eventName",
        "eventYear",
        "eventDates",
        "venue",
        "welcomeMessage",
        "expectation1",
        "expectation2",
        "expectation3",
        "expectation4",
        "specialNote",
        "contactEmail",
      ],
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to {{eventName}}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 30px 20px; text-align: center; }
            .logo { width: 50px; height: 50px; background: rgba(255,255,255,0.2); border-radius: 12px; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
            .content { padding: 30px 20px; }
            .welcome-banner { background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); padding: 25px; border-radius: 12px; text-align: center; margin-bottom: 25px; }
            .event-details { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #e2e8f0; }
            .detail-row:last-child { margin-bottom: 0; border-bottom: none; }
            .detail-label { font-weight: 600; color: #475569; }
            .detail-value { color: #1e293b; }
            .expectations { background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0; }
            .expectations h3 { color: #1e40af; margin-top: 0; margin-bottom: 15px; }
            .expectations ul { margin: 0; padding-left: 20px; }
            .expectations li { margin-bottom: 8px; color: #374151; }
            .special-note { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 25px 0; }
            .footer { background: #f9fafb; padding: 25px 20px; text-align: center; border-top: 1px solid #e5e7eb; }
            @media (max-width: 600px) {
              .container { margin: 0; }
              .header, .content, .footer { padding: 20px 15px; }
              .logo { width: 40px; height: 40px; font-size: 20px; }
              .detail-row { flex-direction: column; }
              .detail-label { margin-bottom: 5px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🏠</div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Shelter Afrique</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">{{eventName}} {{eventYear}}</p>
            </div>
            
            <div class="content">
              <div class="welcome-banner">
                <h2 style="color: #1e40af; margin: 0 0 10px 0; font-size: 24px;">Welcome!</h2>
                <p style="margin: 0; color: #1e293b; font-size: 16px;">{{delegateTitle}} {{delegateName}}</p>
                <p style="margin: 5px 0 0 0; color: #64748b; font-size: 14px;">{{organization}}</p>
              </div>
              
              <div style="margin-bottom: 25px; font-size: 16px; color: #4b5563; line-height: 1.7;">
                {{welcomeMessage}}
              </div>
              
              <div class="event-details">
                <h3 style="color: #1e293b; margin-top: 0; margin-bottom: 15px;">Event Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Event:</span>
                  <span class="detail-value">{{eventName}}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Dates:</span>
                  <span class="detail-value">{{eventDates}}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Venue:</span>
                  <span class="detail-value">{{venue}}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Year:</span>
                  <span class="detail-value">{{eventYear}}</span>
                </div>
              </div>
              
              <div class="expectations">
                <h3>What to Expect:</h3>
                <ul>
                  <li>{{expectation1}}</li>
                  <li>{{expectation2}}</li>
                  <li>{{expectation3}}</li>
                  <li>{{expectation4}}</li>
                </ul>
              </div>
              
              <div class="special-note">
                <strong>Special Note:</strong> {{specialNote}}
              </div>
            </div>
            
            <div class="footer">
              <p><strong>Shelter Afrique</strong></p>
              <p>Email: {{contactEmail}} | {{eventYear}}</p>
              <p style="font-size: 12px; margin-top: 15px;">We look forward to your participation in {{eventName}}.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    },

    // Announcement Template
    {
      id: "important-announcement",
      name: "Important Announcement",
      subject: "{{urgencyLevel}} Priority: {{announcementTitle}}",
      category: "announcement",
      isDefault: true,
      variables: [
        "delegateName",
        "delegateTitle",
        "organization",
        "announcementTitle",
        "announcementBody",
        "urgencyLevel",
        "deadline",
        "actionRequired1",
        "actionRequired2",
        "actionRequired3",
        "actionRequired4",
        "supportMessage",
        "contactEmail",
      ],
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>{{announcementTitle}}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 30px 20px; text-align: center; }
            .logo { width: 50px; height: 50px; background: rgba(255,255,255,0.2); border-radius: 12px; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
            .content { padding: 30px 20px; }
            .urgency-banner { background: #fef2f2; border: 2px solid #fca5a5; border-radius: 8px; padding: 15px; margin-bottom: 25px; text-align: center; }
            .urgency-high { background: #fef2f2; border-color: #fca5a5; }
            .urgency-medium { background: #fef3c7; border-color: #fcd34d; }
            .urgency-low { background: #f0f9ff; border-color: #93c5fd; }
            .announcement-body { font-size: 16px; margin-bottom: 25px; color: #4b5563; line-height: 1.7; }
            .deadline-box { background: #fee2e2; border: 1px solid #fca5a5; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .deadline-box strong { color: #dc2626; font-size: 18px; }
            .actions-required { background: #f0fdf4; border-left: 4px solid #059669; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0; }
            .actions-required h3 { color: #059669; margin-top: 0; margin-bottom: 15px; }
            .actions-required ol { margin: 0; padding-left: 20px; }
            .actions-required li { margin-bottom: 8px; color: #374151; }
            .support-section { background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin: 25px 0; }
            .footer { background: #f9fafb; padding: 25px 20px; text-align: center; border-top: 1px solid #e5e7eb; }
            @media (max-width: 600px) {
              .container { margin: 0; }
              .header, .content, .footer { padding: 20px 15px; }
              .logo { width: 40px; height: 40px; font-size: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🏠</div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Shelter Afrique</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">Official Announcement</p>
            </div>
            
            <div class="content">
              <div class="urgency-banner urgency-{{urgencyLevel}}">
                <strong style="color: #dc2626; font-size: 16px;">{{urgencyLevel}} PRIORITY ANNOUNCEMENT</strong>
              </div>
              
              <div style="margin-bottom: 20px;">
                <p style="margin: 0; color: #6b7280; font-size: 14px;">Dear {{delegateTitle}} {{delegateName}},</p>
                <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">{{organization}}</p>
              </div>
              
              <h2 style="color: #dc2626; margin-bottom: 20px; font-size: 22px;">{{announcementTitle}}</h2>
              
              <div class="announcement-body">
                {{announcementBody}}
              </div>
              
              <div class="deadline-box">
                <p style="margin: 0; color: #374151;">Action Required By:</p>
                <strong>{{deadline}}</strong>
              </div>
              
              <div class="actions-required">
                <h3>Required Actions:</h3>
                <ol>
                  <li>{{actionRequired1}}</li>
                  <li>{{actionRequired2}}</li>
                  <li>{{actionRequired3}}</li>
                  <li>{{actionRequired4}}</li>
                </ol>
              </div>
              
              <div class="support-section">
                <h4 style="color: #1e293b; margin-top: 0;">Need Assistance?</h4>
                <p style="margin: 0; color: #4b5563;">{{supportMessage}}</p>
              </div>
            </div>
            
            <div class="footer">
              <p><strong>Shelter Afrique</strong></p>
              <p>Email: {{contactEmail}}</p>
              <p style="font-size: 12px; margin-top: 15px;">This is an urgent communication. Please take immediate action.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    },

    // Meeting Template
    {
      id: "meeting-invitation",
      name: "Meeting Invitation",
      subject: "Meeting Invitation: {{meetingTitle}} - {{meetingDate}}",
      category: "meeting",
      isDefault: true,
      variables: [
        "delegateName",
        "delegateTitle",
        "organization",
        "meetingTitle",
        "meetingDate",
        "meetingTime",
        "agendaItem1",
        "agendaItem2",
        "agendaItem3",
        "agendaItem4",
        "dresscode",
        "specialInstructions",
        "confirmUrl",
        "declineUrl",
        "contactEmail",
      ],
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>{{meetingTitle}}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); color: white; padding: 30px 20px; text-align: center; }
            .logo { width: 50px; height: 50px; background: rgba(255,255,255,0.2); border-radius: 12px; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
            .content { padding: 30px 20px; }
            .meeting-details { background: #faf5ff; border: 1px solid #d8b4fe; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #e9d5ff; }
            .detail-row:last-child { margin-bottom: 0; border-bottom: none; }
            .detail-label { font-weight: 600; color: #6b21a8; }
            .detail-value { color: #1e293b; }
            .agenda { background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0; }
            .agenda h3 { color: #1e40af; margin-top: 0; margin-bottom: 15px; }
            .agenda ol { margin: 0; padding-left: 20px; }
            .agenda li { margin-bottom: 8px; color: #374151; }
            .rsvp-section { text-align: center; margin: 30px 0; }
            .rsvp-buttons { display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; }
            .rsvp-button { display: inline-block; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; transition: transform 0.2s; }
            .confirm-btn { background: #059669; color: white; }
            .decline-btn { background: #dc2626; color: white; }
            .rsvp-button:hover { transform: translateY(-2px); }
            .instructions { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 25px 0; }
            .footer { background: #f9fafb; padding: 25px 20px; text-align: center; border-top: 1px solid #e5e7eb; }
            @media (max-width: 600px) {
              .container { margin: 0; }
              .header, .content, .footer { padding: 20px 15px; }
              .logo { width: 40px; height: 40px; font-size: 20px; }
              .detail-row { flex-direction: column; }
              .detail-label { margin-bottom: 5px; }
              .rsvp-buttons { flex-direction: column; align-items: center; }
              .rsvp-button { width: 200px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🏠</div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Shelter Afrique</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">Meeting Invitation</p>
            </div>
            
            <div class="content">
              <div style="margin-bottom: 20px;">
                <p style="margin: 0; color: #6b7280; font-size: 16px;">Dear {{delegateTitle}} {{delegateName}},</p>
                <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">{{organization}}</p>
              </div>
              
              <h2 style="color: #7c3aed; margin-bottom: 20px; font-size: 22px;">{{meetingTitle}}</h2>
              
              <p style="font-size: 16px; margin-bottom: 25px; color: #4b5563; line-height: 1.7;">
                You are cordially invited to attend the following meeting. Your participation and insights are valuable to our discussions.
              </p>
              
              <div class="meeting-details">
                <h3 style="color: #6b21a8; margin-top: 0; margin-bottom: 15px;">Meeting Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Meeting:</span>
                  <span class="detail-value">{{meetingTitle}}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date:</span>
                  <span class="detail-value">{{meetingDate}}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Time:</span>
                  <span class="detail-value">{{meetingTime}}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Dress Code:</span>
                  <span class="detail-value">{{dresscode}}</span>
                </div>
              </div>
              
              <div class="agenda">
                <h3>Meeting Agenda:</h3>
                <ol>
                  <li>{{agendaItem1}}</li>
                  <li>{{agendaItem2}}</li>
                  <li>{{agendaItem3}}</li>
                  <li>{{agendaItem4}}</li>
                </ol>
              </div>
              
              <div class="rsvp-section">
                <h3 style="color: #1e293b; margin-bottom: 20px;">Please Confirm Your Attendance</h3>
                <div class="rsvp-buttons">
                  <a href="{{confirmUrl}}" class="rsvp-button confirm-btn">✓ I Will Attend</a>
                  <a href="{{declineUrl}}" class="rsvp-button decline-btn">✗ Cannot Attend</a>
                </div>
              </div>
              
              <div class="instructions">
                <strong>Special Instructions:</strong> {{specialInstructions}}
              </div>
            </div>
            
            <div class="footer">
              <p><strong>Shelter Afrique</strong></p>
              <p>Email: {{contactEmail}}</p>
              <p style="font-size: 12px; margin-top: 15px;">Please respond by the specified deadline to help us prepare accordingly.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    },

    // Newsletter Template
    {
      id: "newsletter",
      name: "Newsletter Update",
      subject: "{{newsletterTitle}} - Shelter Afrique Newsletter",
      category: "newsletter",
      isDefault: true,
      variables: [
        "delegateName",
        "newsletterTitle",
        "featuredStoryTitle",
        "featuredStoryContent",
        "secondaryStoryTitle",
        "secondaryStoryContent",
        "statTitle1",
        "statValue1",
        "statTitle2",
        "statValue2",
        "eventTitle1",
        "eventDate1",
        "eventTitle2",
        "eventDate2",
        "contactEmail",
      ],
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>{{newsletterTitle}}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px 20px; text-align: center; }
            .logo { width: 50px; height: 50px; background: rgba(255,255,255,0.2); border-radius: 12px; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
            .content { padding: 30px 20px; }
            .newsletter-title { text-align: center; margin-bottom: 30px; }
            .newsletter-title h2 { color: #f59e0b; margin: 0; font-size: 28px; }
            .story-section { margin-bottom: 30px; }
            .featured-story { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 0 8px 8px 0; margin-bottom: 25px; }
            .featured-story h3 { color: #92400e; margin-top: 0; margin-bottom: 15px; font-size: 20px; }
            .secondary-story { background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 0 8px 8px 0; margin-bottom: 25px; }
            .secondary-story h3 { color: #1e40af; margin-top: 0; margin-bottom: 15px; font-size: 18px; }
            .stats-section { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 25px 0; }
            .stats-grid { display: flex; justify-content: space-around; text-align: center; }
            .stat-item { flex: 1; }
            .stat-value { font-size: 32px; font-weight: bold; color: #059669; margin-bottom: 5px; }
            .stat-label { font-size: 14px; color: #6b7280; }
            .events-section { background: #f0fdf4; border-left: 4px solid #059669; padding: 20px; border-radius: 0 8px 8px 0; margin: 25px 0; }
            .events-section h3 { color: #059669; margin-top: 0; margin-bottom: 15px; }
            .event-item { display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #dcfce7; }
            .event-item:last-child { margin-bottom: 0; border-bottom: none; }
            .footer { background: #f9fafb; padding: 25px 20px; text-align: center; border-top: 1px solid #e5e7eb; }
            @media (max-width: 600px) {
              .container { margin: 0; }
              .header, .content, .footer { padding: 20px 15px; }
              .logo { width: 40px; height: 40px; font-size: 20px; }
              .stats-grid { flex-direction: column; gap: 15px; }
              .event-item { flex-direction: column; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🏠</div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Shelter Afrique</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">Newsletter Update</p>
            </div>
            
            <div class="content">
              <div class="newsletter-title">
                <h2>{{newsletterTitle}}</h2>
                <p style="color: #6b7280; margin: 10px 0 0 0;">Dear {{delegateName}},</p>
              </div>
              
              <div class="story-section">
                <div class="featured-story">
                  <h3>{{featuredStoryTitle}}</h3>
                  <p style="margin: 0; color: #374151; line-height: 1.7;">{{featuredStoryContent}}</p>
                </div>
                
                <div class="secondary-story">
                  <h3>{{secondaryStoryTitle}}</h3>
                  <p style="margin: 0; color: #374151; line-height: 1.7;">{{secondaryStoryContent}}</p>
                </div>
              </div>
              
              <div class="stats-section">
                <h3 style="color: #1e293b; margin-top: 0; margin-bottom: 20px; text-align: center;">Key Statistics</h3>
                <div class="stats-grid">
                  <div class="stat-item">
                    <div class="stat-value">{{statValue1}}</div>
                    <div class="stat-label">{{statTitle1}}</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">{{statValue2}}</div>
                    <div class="stat-label">{{statTitle2}}</div>
                  </div>
                </div>
              </div>
              
              <div class="events-section">
                <h3>Upcoming Events</h3>
                <div class="event-item">
                  <span style="font-weight: 600; color: #374151;">{{eventTitle1}}</span>
                  <span style="color: #6b7280;">{{eventDate1}}</span>
                </div>
                <div class="event-item">
                  <span style="font-weight: 600; color: #374151;">{{eventTitle2}}</span>
                  <span style="color: #6b7280;">{{eventDate2}}</span>
                </div>
              </div>
            </div>
            
            <div class="footer">
              <p><strong>Shelter Afrique</strong></p>
              <p>Email: {{contactEmail}}</p>
              <p style="font-size: 12px; margin-top: 15px;">Thank you for being part of our community. Together, we're building a better future for Africa.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    },
    {
      id: "reminder-followup",
      name: "Reminder & Follow-up",
      subject: "{{reminderType}}: {{reminderTitle}} - Action Required",
      category: "reminder",
      variables: [
        "delegateName",
        "delegateTitle",
        "organization",
        "reminderType",
        "reminderTitle",
        "reminderMessage",
        "originalDeadline",
        "newDeadline",
        "actionItem1",
        "actionItem2",
        "actionItem3",
        "consequenceNote",
        "supportContact",
        "contactEmail",
        "eventYear",
      ],
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      htmlContent: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{reminderTitle}}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px 20px; text-align: center; }
    .logo { width: 50px; height: 50px; background: rgba(255,255,255,0.2); border-radius: 12px; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
    .content { padding: 30px 20px; }
    .reminder-badge { background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 15px; margin-bottom: 25px; text-align: center; }
    .reminder-badge strong { color: #92400e; font-size: 16px; }
    .deadline-comparison { display: flex; justify-content: space-between; background: #fee2e2; border: 1px solid #fca5a5; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .deadline-item { text-align: center; flex: 1; }
    .deadline-label { font-size: 12px; color: #7f1d1d; font-weight: 600; text-transform: uppercase; }
    .deadline-value { font-size: 16px; color: #dc2626; font-weight: 700; margin-top: 5px; }
    .message-section { background: #f8fafc; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0; }
    .actions-list { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 25px 0; }
    .actions-list h3 { color: #92400e; margin-top: 0; margin-bottom: 15px; }
    .actions-list ul { margin: 0; padding-left: 20px; }
    .actions-list li { margin-bottom: 8px; color: #374151; font-weight: 500; }
    .consequence-note { background: #fee2e2; border: 1px solid #fca5a5; padding: 15px; border-radius: 8px; margin: 25px 0; }
    .support-section { background: #f0f9ff; border: 1px solid #93c5fd; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center; }
    .footer { background: #f9fafb; padding: 25px 20px; text-align: center; border-top: 1px solid #e5e7eb; }
    @media (max-width: 600px) {
      .container { margin: 0; }
      .header, .content, .footer { padding: 20px 15px; }
      .logo { width: 40px; height: 40px; font-size: 20px; }
      .deadline-comparison { flex-direction: column; gap: 15px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🏠</div>
      <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Shelter Afrique</h1>
      <p style="margin: 5px 0 0 0; opacity: 0.9;">{{reminderType}} Notice</p>
    </div>
    
    <div class="content">
      <div class="reminder-badge">
        <strong>{{reminderType}} - {{reminderTitle}}</strong>
      </div>
      
      <div style="margin-bottom: 20px;">
        <p style="margin: 0; color: #6b7280; font-size: 16px;">Dear {{delegateTitle}} {{delegateName}},</p>
        <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">{{organization}}</p>
      </div>
      
      <div class="message-section">
        <div style="color: #374151; line-height: 1.7; font-size: 16px;">
          {{reminderMessage}}
        </div>
      </div>
      
      <div class="deadline-comparison">
        <div class="deadline-item">
          <div class="deadline-label">Original Deadline</div>
          <div class="deadline-value">{{originalDeadline}}</div>
        </div>
        <div class="deadline-item">
          <div class="deadline-label">{{reminderType}} Deadline</div>
          <div class="deadline-value">{{newDeadline}}</div>
        </div>
      </div>
      
      <div class="actions-list">
        <h3>Outstanding Actions:</h3>
        <ul>
          <li>{{actionItem1}}</li>
          <li>{{actionItem2}}</li>
          <li>{{actionItem3}}</li>
        </ul>
      </div>
      
      <div class="consequence-note">
        <strong style="color: #dc2626;">Important:</strong> 
        <span style="color: #7f1d1d;">{{consequenceNote}}</span>
      </div>
      
      <div class="support-section">
        <h4 style="color: #1e40af; margin-top: 0;">Need Assistance?</h4>
        <p style="margin: 0; color: #3730a3;">{{supportContact}}</p>
      </div>
    </div>
    
    <div class="footer">
      <p><strong>Shelter Afrique</strong></p>
      <p>Email: {{contactEmail}} | {{eventYear}}</p>
      <p style="font-size: 12px; margin-top: 15px;">This is an automated reminder. Please take action promptly.</p>
    </div>
  </div>
</body>
</html>
  `,
    },
    {
      id: "status-update",
      name: "Status Update & Progress Report",
      subject: "{{updateType}} Update: {{updateTitle}} - {{delegateName}}",
      category: "update",
      variables: [
        "delegateName",
        "delegateTitle",
        "organization",
        "updateType",
        "updateTitle",
        "updateSummary",
        "progressItem1",
        "progressStatus1",
        "progressItem2",
        "progressStatus2",
        "progressItem3",
        "progressStatus3",
        "nextStep1",
        "nextStep2",
        "nextStep3",
        "timelineUpdate",
        "additionalInfo",
        "contactEmail",
        "eventYear",
      ],
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      htmlContent: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{updateTitle}}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 30px 20px; text-align: center; }
    .logo { width: 50px; height: 50px; background: rgba(255,255,255,0.2); border-radius: 12px; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
    .content { padding: 30px 20px; }
    .update-badge { background: #e0f2fe; border: 2px solid #0ea5e9; border-radius: 8px; padding: 15px; margin-bottom: 25px; text-align: center; }
    .update-badge strong { color: #0c4a6e; font-size: 16px; }
    .summary-section { background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0; }
    .progress-section { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 25px 0; }
    .progress-item { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 15px; background: white; border-radius: 6px; border-left: 4px solid #e2e8f0; }
    .progress-item.completed { border-left-color: #059669; }
    .progress-item.in-progress { border-left-color: #f59e0b; }
    .progress-item.pending { border-left-color: #6b7280; }
    .progress-text { flex: 1; font-weight: 500; color: #374151; }
    .progress-status { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .status-completed { background: #d1fae5; color: #065f46; }
    .status-in-progress { background: #fef3c7; color: #92400e; }
    .status-pending { background: #f3f4f6; color: #374151; }
    .next-steps { background: #f0fdf4; border-left: 4px solid #059669; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0; }
    .next-steps h3 { color: #059669; margin-top: 0; margin-bottom: 15px; }
    .next-steps ol { margin: 0; padding-left: 20px; }
    .next-steps li { margin-bottom: 8px; color: #374151; font-weight: 500; }
    .timeline-update { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 25px 0; }
    .additional-info { background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin: 25px 0; }
    .footer { background: #f9fafb; padding: 25px 20px; text-align: center; border-top: 1px solid #e5e7eb; }
    @media (max-width: 600px) {
      .container { margin: 0; }
      .header, .content, .footer { padding: 20px 15px; }
      .logo { width: 40px; height: 40px; font-size: 20px; }
      .progress-item { flex-direction: column; align-items: flex-start; gap: 10px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🏠</div>
      <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Shelter Afrique</h1>
      <p style="margin: 5px 0 0 0; opacity: 0.9;">{{updateType}} Update</p>
    </div>
    
    <div class="content">
      <div class="update-badge">
        <strong>{{updateType}} - {{updateTitle}}</strong>
      </div>
      
      <div style="margin-bottom: 20px;">
        <p style="margin: 0; color: #6b7280; font-size: 16px;">Dear {{delegateTitle}} {{delegateName}},</p>
        <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">{{organization}}</p>
      </div>
      
      <div class="summary-section">
        <h3 style="color: #0c4a6e; margin-top: 0; margin-bottom: 15px;">Update Summary</h3>
        <div style="color: #374151; line-height: 1.7; font-size: 16px;">
          {{updateSummary}}
        </div>
      </div>
      
      <div class="progress-section">
        <h3 style="color: #1e293b; margin-top: 0; margin-bottom: 20px;">Progress Status</h3>
        
        <div class="progress-item {{progressStatus1}}">
          <div class="progress-text">{{progressItem1}}</div>
          <div class="progress-status status-{{progressStatus1}}">{{progressStatus1}}</div>
        </div>
        
        <div class="progress-item {{progressStatus2}}">
          <div class="progress-text">{{progressItem2}}</div>
          <div class="progress-status status-{{progressStatus2}}">{{progressStatus2}}</div>
        </div>
        
        <div class="progress-item {{progressStatus3}}">
          <div class="progress-text">{{progressItem3}}</div>
          <div class="progress-status status-{{progressStatus3}}">{{progressStatus3}}</div>
        </div>
      </div>
      
      <div class="next-steps">
        <h3>Next Steps:</h3>
        <ol>
          <li>{{nextStep1}}</li>
          <li>{{nextStep2}}</li>
          <li>{{nextStep3}}</li>
        </ol>
      </div>
      
      <div class="timeline-update">
        <strong style="color: #92400e;">Timeline Update:</strong> 
        <span style="color: #374151;">{{timelineUpdate}}</span>
      </div>
      
      <div class="additional-info">
        <h4 style="color: #1e293b; margin-top: 0;">Additional Information</h4>
        <p style="margin: 0; color: #4b5563; line-height: 1.7;">{{additionalInfo}}</p>
      </div>
    </div>
    
    <div class="footer">
      <p><strong>Shelter Afrique</strong></p>
      <p>Email: {{contactEmail}} | {{eventYear}}</p>
      <p style="font-size: 12px; margin-top: 15px;">Stay informed with regular updates on your delegate journey.</p>
    </div>
  </div>
</body>
</html>
  `,
    },
  ]

  getTemplates(): EmailTemplate[] {
    return this.templates
  }

  getTemplate(id: string): EmailTemplate | undefined {
    return this.templates.find((template) => template.id === id)
  }

  saveTemplate(template: Omit<EmailTemplate, "id">): EmailTemplate {
    const newTemplate: EmailTemplate = {
      ...template,
      id: `custom-${Date.now()}`,
    }
    this.templates.push(newTemplate)
    return newTemplate
  }

  replaceVariables(content: string, variables: Record<string, string>): string {
    let result = content
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, "g")
      result = result.replace(regex, value || "")
    })
    return result
  }

  extractVariables(content: string): string[] {
    const matches = content.match(/{{(\w+)}}/g)
    if (!matches) return []
    return [...new Set(matches.map((match) => match.replace(/[{}]/g, "")))]
  }
}

export const templateService = new TemplateService()
