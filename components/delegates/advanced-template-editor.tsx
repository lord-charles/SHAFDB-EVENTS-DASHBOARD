"use client";

import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import {
  Eye,
  Code,
  Save,
  Palette,
  Type,
  ImageIcon,
  Layout,
  Sparkles,
  Download,
  Upload,
  Copy,
  Trash2,
  Plus,
} from "lucide-react";

const professionalTemplates = [
  {
    id: "executive-welcome",
    name: "Executive Welcome",
    category: "Welcome",
    description: "Premium welcome template for VIP delegates",
    thumbnail: "/placeholder.svg?height=120&width=200",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);">
        <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 50px 30px; text-align: center; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -50px; right: -50px; width: 100px; height: 100px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
          <div style="position: absolute; bottom: -30px; left: -30px; width: 60px; height: 60px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
          <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">{{title}}</h1>
          <p style="color: #d1fae5; margin: 15px 0 0 0; font-size: 18px; font-weight: 400;">Building Africa's Housing Future Together</p>
        </div>
        <div style="padding: 50px 30px; background: #ffffff;">
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="display: inline-block; background: #f0fdf4; padding: 15px 25px; border-radius: 50px; border: 2px solid #bbf7d0;">
              <span style="color: #059669; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Welcome Message</span>
            </div>
          </div>
          <div style="background: #f8fafc; padding: 30px; border-radius: 15px; border-left: 5px solid #059669; margin: 30px 0;">
            <p style="color: #1f2937; line-height: 1.8; font-size: 16px; margin: 0;">{{body}}</p>
          </div>
          <div style="text-align: center; margin: 40px 0;">
            <a href="#" style="display: inline-block; background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 15px 35px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 10px 25px rgba(5, 150, 105, 0.3); transition: all 0.3s ease;">
              Access Your Dashboard
            </a>
          </div>
        </div>
        <div style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; margin: 0; font-size: 14px; line-height: 1.6;">
            © {{year}} Shelter Afrique. All rights reserved.<br>
            <span style="color: #059669; font-weight: 500;">Transforming Africa's Housing Landscape</span>
          </p>
        </div>
      </div>
    `,
  },
  {
    id: "modern-announcement",
    name: "Modern Announcement",
    category: "Announcement",
    description: "Clean, modern template for important updates",
    thumbnail: "/placeholder.svg?height=120&width=200",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); padding: 40px 30px; position: relative;">
          <div style="text-align: center;">
            <div style="display: inline-block; background: rgba(255,255,255,0.2); padding: 12px 24px; border-radius: 25px; margin-bottom: 20px;">
              <span style="color: #bfdbfe; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Important Announcement</span>
            </div>
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; line-height: 1.2;">{{title}}</h1>
          </div>
        </div>
        <div style="padding: 40px 30px;">
          <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 5px solid #f59e0b; padding: 25px; margin: 0 0 30px 0; border-radius: 10px;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <div style="width: 20px; height: 20px; background: #f59e0b; border-radius: 50%; margin-right: 10px;"></div>
              <span style="color: #92400e; font-weight: 700; font-size: 14px;">ATTENTION REQUIRED</span>
            </div>
            <p style="color: #92400e; margin: 0; font-weight: 500; font-size: 14px;">Please read this announcement carefully</p>
          </div>
          <div style="color: #374151; line-height: 1.8; font-size: 16px; margin: 0 0 30px 0;">{{body}}</div>
          <div style="background: #f3f4f6; padding: 25px; border-radius: 10px; text-align: center;">
            <p style="color: #6b7280; margin: 0; font-size: 14px; line-height: 1.6;">
              For questions or clarifications, please contact our support team
            </p>
          </div>
        </div>
        <div style="background: #f9fafb; padding: 25px; text-align: center;">
          <p style="color: #6b7280; margin: 0; font-size: 12px;">
            Shelter Afrique - Building Africa's Housing Future | {{year}}
          </p>
        </div>
      </div>
    `,
  },
  {
    id: "premium-meeting",
    name: "Premium Meeting Invitation",
    category: "Meeting",
    description: "Elegant invitation template for AGM and meetings",
    thumbnail: "/placeholder.svg?height=120&width=200",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); padding: 50px 30px; text-align: center; position: relative;">
          <div style="position: absolute; top: 20px; left: 20px; width: 40px; height: 40px; border: 2px solid rgba(255,255,255,0.3); border-radius: 50%;"></div>
          <div style="position: absolute; bottom: 20px; right: 20px; width: 60px; height: 60px; border: 2px solid rgba(255,255,255,0.2); border-radius: 50%;"></div>
          <div style="display: inline-block; background: rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 20px; margin-bottom: 20px;">
            <span style="color: #e9d5ff; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">You're Invited</span>
          </div>
          <h1 style="color: #ffffff; margin: 0; font-size: 30px; font-weight: 700; line-height: 1.2;">{{title}}</h1>
        </div>
        <div style="padding: 40px 30px;">
          <div style="background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%); border: 2px solid #c4b5fd; border-radius: 15px; padding: 30px; margin: 0 0 30px 0;">
            <h3 style="color: #7c3aed; margin: 0 0 15px 0; font-size: 20px; font-weight: 700;">Meeting Details</h3>
            <div style="color: #374151; line-height: 1.8; font-size: 16px;">{{body}}</div>
          </div>
          <div style="text-align: center; margin: 40px 0;">
            <a href="#" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); color: white; padding: 18px 40px; text-decoration: none; border-radius: 50px; font-weight: 700; font-size: 16px; box-shadow: 0 15px 35px rgba(124, 58, 237, 0.4); transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 0.5px;">
              Confirm Attendance
            </a>
          </div>
          <div style="background: #f8fafc; padding: 25px; border-radius: 10px; border: 1px solid #e5e7eb;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="color: #374151; margin: 0; font-weight: 600; font-size: 14px;">Need assistance?</p>
                <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 12px;">Contact our event coordination team</p>
              </div>
              <div style="background: #7c3aed; color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                SUPPORT
              </div>
            </div>
          </div>
        </div>
        <div style="background: #f9fafb; padding: 25px; text-align: center;">
          <p style="color: #6b7280; margin: 0; font-size: 12px;">
            Shelter Afrique Annual General Meeting {{year}} | Building Africa's Housing Future
          </p>
        </div>
      </div>
    `,
  },
];

export function AdvancedTemplateEditor() {
  const [selectedTemplate, setSelectedTemplate] = useState(
    professionalTemplates[0]
  );
  const [customHtml, setCustomHtml] = useState(selectedTemplate.html);
  const [previewData, setPreviewData] = useState({
    title: "Welcome to Shelter Afrique AGM 2025",
    body: "We are excited to invite you to our Annual General Meeting. This year's theme focuses on sustainable housing solutions across Africa. Join us for three days of networking, learning, and collaboration that will shape the future of housing development across our continent.",
    year: "2025",
  });
  const [activeTab, setActiveTab] = useState("visual");
  const [templateName, setTemplateName] = useState("");
  const [templateCategory, setTemplateCategory] = useState("welcome");

  // Visual editor states
  const [headerColor, setHeaderColor] = useState("#059669");
  const [textColor, setTextColor] = useState("#374151");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState("16");
  const [borderRadius, setBorderRadius] = useState("10");
  const [showImages, setShowImages] = useState(true);

  const handleTemplateChange = (templateId: string) => {
    const template = professionalTemplates.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      setCustomHtml(template.html);
    }
  };

  const renderPreview = () => {
    let html = customHtml;
    Object.entries(previewData).forEach(([key, value]) => {
      html = html.replace(new RegExp(`{{${key}}}`, "g"), value);
    });
    return html;
  };

  const generateVisualTemplate = () => {
    const visualTemplate = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background: ${backgroundColor};">
        <div style="background: ${headerColor}; padding: 40px 30px; text-align: center; border-radius: ${borderRadius}px ${borderRadius}px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: ${
            Number.parseInt(fontSize) + 12
          }px; font-weight: 700;">{{title}}</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0 0; font-size: ${fontSize}px;">Shelter Afrique</p>
        </div>
        <div style="padding: 40px 30px;">
          <div style="color: ${textColor}; line-height: 1.8; font-size: ${fontSize}px; margin: 0 0 30px 0;">{{body}}</div>
          ${
            showImages
              ? `<div style="text-align: center; margin: 30px 0;"><img src="/placeholder.svg?height=200&width=400" style="max-width: 100%; border-radius: ${borderRadius}px;" alt="Shelter Afrique"></div>`
              : ""
          }
        </div>
        <div style="background: #f9fafb; padding: 25px; text-align: center; border-radius: 0 0 ${borderRadius}px ${borderRadius}px;">
          <p style="color: #6b7280; margin: 0; font-size: 12px;">© {{year}} Shelter Afrique. All rights reserved.</p>
        </div>
      </div>
    `;
    setCustomHtml(visualTemplate);
  };

  const categories = Array.from(
    new Set(professionalTemplates.map((t) => t.category))
  );

  return (
    <div className="space-y-8">
      {/* Template Library */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                <Sparkles className="h-6 w-6 mr-3 text-purple-600" />
                Professional Template Library
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Choose from our collection of professionally designed email
                templates
              </CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                className="border-purple-200 bg-transparent"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-purple-200 bg-transparent"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {professionalTemplates.map((template) => (
              <div
                key={template.id}
                className={`group relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedTemplate.id === template.id
                    ? "border-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-md"
                    : "border-gray-200 hover:border-purple-300 bg-white hover:bg-purple-50/30"
                }`}
                onClick={() => handleTemplateChange(template.id)}
              >
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 overflow-hidden">
                  <ImageIcon className="w-full h-full object-cover" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">{template.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {template.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {template.description}
                  </p>
                  {selectedTemplate.id === template.id && (
                    <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                      <Eye className="h-3 w-3 mr-1" />
                      Selected
                    </Badge>
                  )}
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Editor */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <Layout className="h-5 w-5 mr-3 text-blue-600" />
                Advanced Template Editor
              </CardTitle>
              <CardDescription>
                Professional email template designer with visual and code
                editing
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Template
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-indigo-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Template Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Template Name
              </Label>
              <Input
                placeholder="Enter template name..."
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="border-purple-200"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Category
              </Label>
              <Select
                value={templateCategory}
                onValueChange={setTemplateCategory}
              >
                <SelectTrigger className="border-purple-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Preview Data
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Title"
                  value={previewData.title}
                  onChange={(e) =>
                    setPreviewData({ ...previewData, title: e.target.value })
                  }
                  className="border-purple-200 text-sm"
                />
              </div>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-3 bg-white border border-purple-200">
              <TabsTrigger
                value="visual"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
              >
                <Palette className="h-4 w-4 mr-2" />
                Visual Editor
              </TabsTrigger>
              <TabsTrigger
                value="code"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
              >
                <Code className="h-4 w-4 mr-2" />
                Code Editor
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
              >
                <Eye className="h-4 w-4 mr-2" />
                Live Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="visual" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Palette className="h-5 w-5 mr-2" />
                        Colors & Styling
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Header Color</Label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={headerColor}
                              onChange={(e) => setHeaderColor(e.target.value)}
                              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                            />
                            <Input
                              value={headerColor}
                              onChange={(e) => setHeaderColor(e.target.value)}
                              className="flex-1 text-sm"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Text Color</Label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={textColor}
                              onChange={(e) => setTextColor(e.target.value)}
                              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                            />
                            <Input
                              value={textColor}
                              onChange={(e) => setTextColor(e.target.value)}
                              className="flex-1 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Background Color</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                          />
                          <Input
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Type className="h-5 w-5 mr-2" />
                        Typography & Layout
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Font Size (px)</Label>
                          <Input
                            type="number"
                            value={fontSize}
                            onChange={(e) => setFontSize(e.target.value)}
                            min="12"
                            max="24"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Border Radius (px)</Label>
                          <Input
                            type="number"
                            value={borderRadius}
                            onChange={(e) => setBorderRadius(e.target.value)}
                            min="0"
                            max="50"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Include Images</Label>
                        <Switch
                          checked={showImages}
                          onCheckedChange={setShowImages}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    onClick={generateVisualTemplate}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Apply Visual Changes
                  </Button>
                </div>

                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Live Preview</Label>
                  <div className="border-2 border-dashed border-purple-200 rounded-xl overflow-hidden bg-gray-50">
                    <div className="bg-white p-4 border-b border-purple-200">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-gray-600 ml-4">
                          Email Preview
                        </span>
                      </div>
                    </div>
                    <div
                      className="p-6 bg-white min-h-96 overflow-auto"
                      dangerouslySetInnerHTML={{ __html: renderPreview() }}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="code" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold">
                      HTML Template Code
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    value={customHtml}
                    onChange={(e) => setCustomHtml(e.target.value)}
                    rows={25}
                    className="font-mono text-sm border-purple-200 bg-gray-50"
                    placeholder="Enter your HTML template here..."
                  />
                  <div className="flex items-center space-x-2 text-sm text-gray-600 bg-purple-50 p-3 rounded-lg">
                    <span className="font-medium">Available variables:</span>
                    <Badge variant="outline" className="text-xs">
                      {"{{title}}"}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {"{{body}}"}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {"{{year}}"}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Preview Data</Label>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-sm">Title</Label>
                      <Input
                        value={previewData.title}
                        onChange={(e) =>
                          setPreviewData({
                            ...previewData,
                            title: e.target.value,
                          })
                        }
                        className="border-purple-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Year</Label>
                      <Input
                        value={previewData.year}
                        onChange={(e) =>
                          setPreviewData({
                            ...previewData,
                            year: e.target.value,
                          })
                        }
                        className="border-purple-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Body Message</Label>
                      <Textarea
                        value={previewData.body}
                        onChange={(e) =>
                          setPreviewData({
                            ...previewData,
                            body: e.target.value,
                          })
                        }
                        rows={8}
                        className="border-purple-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-6">
              <div className="border-2 border-purple-200 rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-purple-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700 ml-4">
                        {selectedTemplate.name} - Live Preview
                      </span>
                    </div>
                    <Badge className="bg-purple-100 text-purple-700">
                      {selectedTemplate.category}
                    </Badge>
                  </div>
                </div>
                <div
                  className="p-8 bg-white min-h-96 overflow-auto"
                  dangerouslySetInnerHTML={{ __html: renderPreview() }}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
