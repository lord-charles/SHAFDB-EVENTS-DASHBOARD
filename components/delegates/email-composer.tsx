"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Mail,
  Send,
  LayoutTemplateIcon as Template,
  FileText,
  Eye,
  Save,
  Users,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Globe,
  User,
} from "lucide-react";
import type { Delegate } from "@/types/delegate";
import type { EmailTemplate, EmailPayload } from "@/types/api";
import { templateService } from "@/services/templateService";
import { apiService } from "@/services/api";

interface EmailComposerProps {
  selectedDelegates: Delegate[];
}

export function EmailComposer({ selectedDelegates }: EmailComposerProps) {
  const [compositionMode, setCompositionMode] = useState<"template" | "raw">(
    "template"
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [templates, setTemplates] = useState<any[]>([]);

  // Email content
  const [subject, setSubject] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [plainContent, setPlainContent] = useState("");

  // Template variables
  const [templateVariables, setTemplateVariables] = useState<
    Record<string, string>
  >({});

  // Sending state
  const [sending, setSending] = useState(false);
  const [sendProgress, setSendProgress] = useState(0);
  const [sendResult, setSendResult] = useState<{
    success: boolean;
    message: string;
    count: number;
  } | null>(null);

  // Load templates on mount
  useEffect(() => {
    setTemplates(templateService.getTemplates());
  }, []);

  // Update content when template is selected
  useEffect(() => {
    if (selectedTemplateId && compositionMode === "template") {
      const template = templateService.getTemplate(selectedTemplateId);
      if (template) {
        setSubject(template.subject);
        setHtmlContent(template.htmlContent);

        // Initialize template variables
        const variables: Record<string, string> = {};
        template.variables.forEach((variable) => {
          variables[variable] = getDefaultVariableValue(variable);
        });
        setTemplateVariables(variables);
      }
    }
  }, [selectedTemplateId, compositionMode]);

  const getDefaultVariableValue = (variable: string): string => {
    const defaults: Record<string, string> = {
      // Universal Standard Template
      subject: "Important Update from Shelter Afrique",
      delegateName: "Delegate",
      delegateTitle: "Dr.",
      organization: "Your Organization",
      mainTitle: "Important Communication",
      mainMessage:
        "We are pleased to share this important update with you as a valued member of the Shelter Afrique community.",
      keyPoint1:
        "Strategic discussions on sustainable housing solutions across Africa",
      keyPoint2:
        "Networking opportunities with industry leaders and policymakers",
      keyPoint3:
        "Insights into innovative financing mechanisms for housing development",
      keyPoint4:
        "Collaborative sessions on regional housing challenges and solutions",
      callToActionText: "Access Delegate Portal",
      callToActionUrl: "#",
      importantNote:
        "Please ensure you have all required documentation ready. Our dedicated support team is available to assist you with any questions.",
      contactEmail: "info@shelterafrique.org",
      eventYear: new Date().getFullYear().toString(),

      // Welcome Template
      eventName: "Annual General Meeting",
      eventDates: "July 14-18, 2025",
      venue: "Algiers, Algeria",
      welcomeMessage:
        "We are honored to welcome you to Shelter Afrique Annual General Meeting 2025. As a distinguished representative from your organization, your expertise and participation are invaluable to our mission.",
      expectation1:
        "Strategic discussions on sustainable housing solutions across Africa",
      expectation2:
        "Networking opportunities with industry leaders and policymakers",
      expectation3:
        "Insights into innovative financing mechanisms for housing development",
      expectation4:
        "Collaborative sessions on regional housing challenges and solutions",
      specialNote:
        "Please ensure you have all required documentation ready for the event. Our dedicated support team is available to assist you.",

      // Announcement Template
      announcementTitle: "Important Update",
      announcementBody:
        "We are writing to inform you of important changes that require your immediate attention. Please review the information below carefully and take the necessary actions.",
      urgencyLevel: "High",
      deadline: "31st May 2025",
      actionRequired1: "Review the attached documentation carefully",
      actionRequired2: "Complete any required forms or submissions",
      actionRequired3: "Confirm your response via the delegate portal",
      actionRequired4: "Contact support if you need assistance",
      supportMessage:
        "Our support team is standing by to help you with any questions or concerns.",

      // Meeting Template
      meetingTitle: "Board Strategy Meeting",
      meetingDate: "14 July 2025",
      meetingTime: "09:00 AM",
      agendaItem1: "Opening Remarks and Welcome",
      agendaItem2: "Strategic Review and Planning",
      agendaItem3: "Project Updates and Progress",
      agendaItem4: "Q&A and Closing Remarks",
      dresscode: "Business Formal",
      specialInstructions:
        "Arrive 15 minutes early for registration and networking.",
      confirmUrl: "#confirm",
      declineUrl: "#decline",

      // Newsletter Template
      newsletterTitle: "Our Journey Continues",
      featuredStoryTitle: "Breaking Ground on New Projects",
      featuredStoryContent:
        "Shelter Afrique breaks ground on affordable housing project in Nairobi, marking a significant milestone in our commitment to sustainable urban development across Africa.",
      secondaryStoryTitle: "Securing Future Funding",
      secondaryStoryContent:
        "We successfully secured USD 100M in funding for green homes initiative, demonstrating our commitment to environmentally sustainable housing solutions.",
      statTitle1: "Projects Funded",
      statValue1: "54",
      statTitle2: "YoY Growth",
      statValue2: "23%",
      eventTitle1: "Housing Expo 2025",
      eventDate1: "September 15-17",
      eventTitle2: "Finance Summit",
      eventDate2: "November 8-10",
    };
    return defaults[variable] || "";
  };

  const handleSendEmail = async () => {
    if (!subject || (!htmlContent && !plainContent)) {
      setSendResult({
        success: false,
        message: "Please provide both subject and content for the email.",
        count: 0,
      });
      return;
    }

    setSending(true);
    setSendProgress(0);
    setSendResult(null);

    try {
      let finalContent = htmlContent || plainContent;
      let finalSubject = subject;

      // Replace variables if using template
      if (
        compositionMode === "template" &&
        Object.keys(templateVariables).length > 0
      ) {
        finalContent = templateService.replaceVariables(
          finalContent,
          templateVariables
        );
        finalSubject = templateService.replaceVariables(
          finalSubject,
          templateVariables
        );
      }

      const emailPayload: EmailPayload = {
        title: finalSubject,
        body: finalContent,
      };

      if (selectedDelegates.length === 0) {
        // Send to all delegates
        setSendProgress(50);
        const response = await apiService.sendEmailToAll(emailPayload);
        setSendProgress(100);

        setSendResult({
          success: true,
          message: response.message,
          count: 0,
        });
      } else {
        // Send to selected delegates
        const total = selectedDelegates.length;
        let completed = 0;
        let failed = 0;

        for (const delegate of selectedDelegates) {
          try {
            await apiService.sendEmailToDelegate(delegate._id, emailPayload);
            completed++;
          } catch (error) {
            console.error(`Failed to send to ${delegate.email}:`, error);
            failed++;
          }

          setSendProgress(((completed + failed) / total) * 100);
          await new Promise((resolve) => setTimeout(resolve, 150));
        }

        setSendResult({
          success: failed === 0,
          message:
            failed === 0
              ? `Successfully sent emails to ${completed} delegates`
              : `Sent to ${completed} delegates, ${failed} failed`,
          count: completed,
        });
      }
    } catch (error) {
      console.error("Error sending emails:", error);
      setSendResult({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to send emails",
        count: 0,
      });
    } finally {
      setSending(false);
    }
  };

  const handleSaveAsTemplate = () => {
    if (!subject || !htmlContent) {
      alert("Please provide subject and content before saving as template");
      return;
    }

    const name = prompt("Enter template name:");
    if (!name) return;

    const variables = templateService.extractVariables(
      htmlContent + " " + subject
    );

    try {
      const newTemplate = templateService.saveTemplate({
        name,
        subject,
        htmlContent,
        category: "custom",
        variables,
      });

      setTemplates(templateService.getTemplates());
      alert(`Template "${newTemplate.name}" saved!`);
    } catch {
      alert("Failed to save template");
    }
  };

  const renderTemplateVariables = () => {
    if (compositionMode !== "template" || !selectedTemplateId) return null;
    const template = templateService.getTemplate(selectedTemplateId);
    if (!template || template.variables.length === 0) return null;

    return (
      <Card className="border border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center text-foreground">
            <FileText className="h-5 w-5 mr-2 text-primary" />
            Template Variables
          </CardTitle>
          <CardDescription>
            Customize the dynamic content for this template
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {template.variables.map((variable) => (
              <div key={variable} className="space-y-2">
                <Label className="text-sm font-medium capitalize">
                  {variable.replace(/([A-Z])/g, " $1")}
                </Label>
                <Input
                  value={templateVariables[variable] || ""}
                  onChange={(e) =>
                    setTemplateVariables((prev) => ({
                      ...prev,
                      [variable]: e.target.value,
                    }))
                  }
                  placeholder={`Enter ${variable}`}
                  className="border border-primary/20"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderPreview = () => {
    let previewContent = htmlContent || plainContent;
    let previewSubject = subject;

    if (
      compositionMode === "template" &&
      Object.keys(templateVariables).length > 0
    ) {
      previewContent = templateService.replaceVariables(
        previewContent,
        templateVariables
      );
      previewSubject = templateService.replaceVariables(
        previewSubject,
        templateVariables
      );
    }

    return (
      <div className="border rounded-lg overflow-hidden border-primary/20">
        <div className="bg-muted px-4 py-3 border-b border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground">Email Preview</span>
            </div>
            <Badge variant="outline" className="border-primary/30 text-primary">
              {compositionMode === "template" ? "Template Mode" : "Raw Mode"}
            </Badge>
          </div>
        </div>
        <div className="p-4 bg-background">
          <div className="mb-4 pb-4 border-b border-muted">
            <p className="text-sm text-muted-foreground mb-1">Subject:</p>
            <p className="font-semibold text-foreground">{previewSubject}</p>
          </div>
          {htmlContent ? (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: previewContent }}
            />
          ) : (
            <div className="whitespace-pre-wrap text-foreground">
              {previewContent}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Recipients Summary */}
      <Card className="border-0 shadow-lg bg-muted">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-foreground flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                Email Recipients
              </CardTitle>
              <CardDescription className="text-primary">
                {selectedDelegates.length === 0
                  ? "Broadcasting to all approved delegates"
                  : `Sending to ${selectedDelegates.length} selected delegate${
                      selectedDelegates.length > 1 ? "s" : ""
                    }`}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {selectedDelegates.length === 0 ? (
                <Badge variant="pending">
                  <Globe className="h-3 w-3 mr-1" />
                  Broadcast Mode
                </Badge>
              ) : (
                <Badge variant="default">
                  <User className="h-3 w-3 mr-1" />
                  {selectedDelegates.length} Selected
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Composition Panel */}
      <Card className="border-0 shadow-lg bg-background">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground flex items-center">
            <Mail className="h-6 w-6 mr-3 text-primary" />
            Email Composition
          </CardTitle>
          <CardDescription>
            Choose between professional templates or compose raw emails
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs
            value={compositionMode}
            onValueChange={(v) => setCompositionMode(v as "template" | "raw")}
          >
            <TabsList className="grid w-full grid-cols-2 bg-muted">
              <TabsTrigger
                value="template"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Template className="h-4 w-4 mr-2" />
                Use Template
              </TabsTrigger>
              <TabsTrigger
                value="raw"
                className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
              >
                <FileText className="h-4 w-4 mr-2" />
                Raw Email
              </TabsTrigger>
            </TabsList>

            {/* TEMPLATE MODE */}
            <TabsContent value="template" className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base font-semibold text-foreground">
                  Select Professional Template
                </Label>
                <Select
                  value={selectedTemplateId}
                  onValueChange={setSelectedTemplateId}
                >
                  <SelectTrigger className="border border-primary/20">
                    <SelectValue placeholder="Choose a template..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-72 overflow-y-auto">
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        <div className="flex items-center space-x-2">
                          <span>{template.name}</span>
                          {template.isDefault && (
                            <Badge variant="outline" className="text-xs">
                              Official
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Template Variables */}
              {renderTemplateVariables()}

              {/* Subject editable */}
              <div className="space-y-2">
                <Label className="text-base font-semibold text-foreground">
                  Email Subject
                </Label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter email subject..."
                  className="border border-primary/20 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base font-semibold text-foreground flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  Email Preview
                </Label>
                {renderPreview()}
              </div>
            </TabsContent>

            {/* RAW MODE */}
            <TabsContent value="raw" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-base font-semibold text-foreground">
                      Email Subject *
                    </Label>
                    <Input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Enter email subject..."
                      className="border  focus:border-secondary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-semibold text-foreground">
                      HTML Content
                    </Label>
                    <Textarea
                      value={htmlContent}
                      onChange={(e) => setHtmlContent(e.target.value)}
                      placeholder="Enter HTML email content..."
                      rows={12}
                      className="font-mono text-sm border  focus:border-secondary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-semibold text-foreground">
                      Plain Text Fallback
                    </Label>
                    <Textarea
                      value={plainContent}
                      onChange={(e) => setPlainContent(e.target.value)}
                      placeholder="Enter plain text version..."
                      rows={6}
                      className="border  focus:border-secondary"
                    />
                  </div>

                  <Button
                    onClick={handleSaveAsTemplate}
                    variant="outline"
                    className="w-full border  hover:bg-secondary/10 bg-transparent"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save as Template
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold text-foreground flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    Live Preview
                  </Label>
                  {renderPreview()}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Send Actions */}
          <div className="flex flex-col space-y-4 pt-6 border-t border-muted">
            {sending && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Sending emails...
                  </span>
                  <span className="font-medium text-foreground">
                    {Math.round(sendProgress)}%
                  </span>
                </div>
                <Progress value={sendProgress} className="h-2" />
              </div>
            )}

            <Button
              onClick={handleSendEmail}
              disabled={sending || !subject || (!htmlContent && !plainContent)}
              className="w-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
              size="lg"
            >
              {sending ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Sending Emails...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Send Email{" "}
                  {selectedDelegates.length > 0 &&
                    `(${selectedDelegates.length})`}
                </>
              )}
            </Button>

            {/* Send Result */}
            {sendResult && (
              <Alert
                className={
                  sendResult.success
                    ? "border-primary/20 bg-primary/10 dark:bg-primary/20"
                    : "border-destructive/20 bg-destructive/10 dark:bg-destructive/20"
                }
              >
                {sendResult.success ? (
                  <CheckCircle className="h-5 w-5 text-primary" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                )}
                <AlertDescription
                  className={
                    sendResult.success ? "text-primary" : "text-destructive"
                  }
                >
                  {sendResult.message}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
