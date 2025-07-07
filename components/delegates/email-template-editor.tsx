"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Code, Save } from "lucide-react"

const templates = [
  {
    id: "welcome",
    name: "Welcome Message",
    description: "Welcome new delegates to Shelter Afrique",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Welcome to Shelter Afrique</h1>
          <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px;">Building Africa's Housing Future Together</p>
        </div>
        <div style="padding: 40px 20px;">
          <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">{{title}}</h2>
          <p style="color: #4b5563; line-height: 1.6; font-size: 16px; margin: 0 0 20px 0;">{{body}}</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #6b7280; margin: 0; font-size: 14px; text-align: center;">
              This message was sent to all Shelter Afrique delegates for {{year}}
            </p>
          </div>
        </div>
        <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; margin: 0; font-size: 12px;">
            © 2025 Shelter Afrique. All rights reserved.
          </p>
        </div>
      </div>
    `,
  },
  {
    id: "announcement",
    name: "General Announcement",
    description: "For important announcements and updates",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: #ffffff; padding: 20px; border-bottom: 3px solid #059669;">
          <div style="text-align: center;">
            <div style="display: inline-block; background: #059669; color: white; padding: 10px 20px; border-radius: 20px; font-weight: bold; margin-bottom: 20px;">
              ANNOUNCEMENT
            </div>
            <h1 style="color: #1f2937; margin: 0; font-size: 28px; font-weight: bold;">{{title}}</h1>
          </div>
        </div>
        <div style="padding: 40px 20px;">
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 0 0 30px 0;">
            <p style="color: #92400e; margin: 0; font-weight: 600;">Important Update</p>
          </div>
          <p style="color: #4b5563; line-height: 1.6; font-size: 16px; margin: 0 0 20px 0;">{{body}}</p>
        </div>
        <div style="background: #f9fafb; padding: 20px; text-align: center;">
          <p style="color: #6b7280; margin: 0; font-size: 12px;">
            Shelter Afrique - Building Africa's Housing Future
          </p>
        </div>
      </div>
    `,
  },
  {
    id: "meeting",
    name: "Meeting Invitation",
    description: "For AGM and meeting invitations",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">{{title}}</h1>
          <p style="color: #bfdbfe; margin: 10px 0 0 0; font-size: 16px;">You're Invited</p>
        </div>
        <div style="padding: 40px 20px;">
          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 0 0 30px 0;">
            <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 18px;">Meeting Details</h3>
            <p style="color: #1f2937; margin: 0; line-height: 1.6;">{{body}}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
              Confirm Attendance
            </a>
          </div>
        </div>
        <div style="background: #f9fafb; padding: 20px; text-align: center;">
          <p style="color: #6b7280; margin: 0; font-size: 12px;">
            Shelter Afrique Annual General Meeting {{year}}
          </p>
        </div>
      </div>
    `,
  },
]

export function EmailTemplateEditor() {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0])
  const [customHtml, setCustomHtml] = useState(selectedTemplate.html)
  const [previewData, setPreviewData] = useState({
    title: "Welcome to Shelter Afrique AGM 2025",
    body: "We are excited to invite you to our Annual General Meeting. This year's theme focuses on sustainable housing solutions across Africa. Join us for three days of networking, learning, and collaboration.",
    year: "2025",
  })

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      setSelectedTemplate(template)
      setCustomHtml(template.html)
    }
  }

  const renderPreview = () => {
    let html = customHtml
    Object.entries(previewData).forEach(([key, value]) => {
      html = html.replace(new RegExp(`{{${key}}}`, "g"), value)
    })
    return html
  }

  return (
    <div className="space-y-6">
      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Email Template Designer</CardTitle>
          <CardDescription>
            Create and customize professional email templates for delegate communications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Template Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Choose Template</h3>
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Template
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                    selectedTemplate.id === template.id
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 hover:border-emerald-300"
                  }`}
                  onClick={() => handleTemplateChange(template.id)}
                >
                  <h4 className="font-medium text-gray-900 mb-2">{template.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  <Badge
                    variant={selectedTemplate.id === template.id ? "default" : "secondary"}
                    className={selectedTemplate.id === template.id ? "bg-emerald-100 text-emerald-700" : ""}
                  >
                    {selectedTemplate.id === template.id ? "Selected" : "Available"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Preview Data */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Preview Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Title</label>
                <Input
                  value={previewData.title}
                  onChange={(e) => setPreviewData({ ...previewData, title: e.target.value })}
                  className="border-emerald-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Year</label>
                <Input
                  value={previewData.year}
                  onChange={(e) => setPreviewData({ ...previewData, year: e.target.value })}
                  className="border-emerald-200"
                />
              </div>
              <div className="space-y-2 md:col-span-1">
                <label className="text-sm font-medium text-gray-700">Body</label>
                <Textarea
                  value={previewData.body}
                  onChange={(e) => setPreviewData({ ...previewData, body: e.target.value })}
                  rows={3}
                  className="border-emerald-200"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editor and Preview */}
      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900">Template Editor</CardTitle>
          <CardDescription>Edit HTML template and preview the result</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="preview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="preview"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="code" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <Code className="h-4 w-4 mr-2" />
                HTML Code
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="space-y-4">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-gray-600 ml-4">Email Preview</span>
                  </div>
                </div>
                <div
                  className="p-4 bg-white min-h-96 overflow-auto"
                  dangerouslySetInnerHTML={{ __html: renderPreview() }}
                />
              </div>
            </TabsContent>

            <TabsContent value="code" className="space-y-4">
              <Textarea
                value={customHtml}
                onChange={(e) => setCustomHtml(e.target.value)}
                rows={20}
                className="font-mono text-sm border-emerald-200"
                placeholder="Enter your HTML template here..."
              />
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Available variables:</span>
                <Badge variant="outline">{"{{title}}"}</Badge>
                <Badge variant="outline">{"{{body}}"}</Badge>
                <Badge variant="outline">{"{{year}}"}</Badge>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
