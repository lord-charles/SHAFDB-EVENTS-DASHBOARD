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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Bell,
  Send,
  Globe,
  User,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Volume2,
  VolumeX,
  Smartphone,
  Zap,
} from "lucide-react";
import type { Delegate } from "@/types/delegate";
import type { PushPayload } from "@/types/api";
import { sendPushToAll, sendPushToDelegate } from "@/services/delegates.service";

interface PushNotificationCenterProps {
  selectedDelegates: Delegate[];
}

export function PushNotificationCenter({
  selectedDelegates,
}: PushNotificationCenterProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sound, setSound] = useState("default");
  const [enableSound, setEnableSound] = useState(true);
  const [priority, setPriority] = useState("normal");
  const [customData, setCustomData] = useState("");

  // Sending state
  const [sending, setSending] = useState(false);
  const [sendProgress, setSendProgress] = useState(0);
  const [sendResult, setSendResult] = useState<{
    success: boolean;
    message: string;
    count: number;
  } | null>(null);

  const handleSendPush = async () => {
    if (!title || !body) {
      setSendResult({
        success: false,
        message:
          "Please provide both title and message for the push notification.",
        count: 0,
      });
      return;
    }

    setSending(true);
    setSendProgress(0);
    setSendResult(null);

    try {
      let data: Record<string, any> = { priority };

      // Parse custom data if provided
      if (customData.trim()) {
        try {
          data = { ...data, ...JSON.parse(customData) };
        } catch (error) {
          console.error("Invalid JSON in custom data:", error);
        }
      }

      const pushPayload: PushPayload = {
        title,
        body,
        sound: enableSound ? sound : undefined,
        data,
      };

      if (selectedDelegates.length === 0) {
        // Send to all delegates
        setSendProgress(50);
        const response = await sendPushToAll(pushPayload);
        setSendProgress(100);

        setSendResult({
          success: true,
          message: response.message,
          count: 0, // API doesn't return count for "all"
        });
      } else {
        // Send to selected delegates
        const total = selectedDelegates.length;
        let completed = 0;
        let failed = 0;

        for (const delegate of selectedDelegates) {
          try {
            await sendPushToDelegate(delegate._id, pushPayload);
            completed++;
          } catch (error) {
            console.error(`Failed to send push to ${delegate.email}:`, error);
            failed++;
          }

          setSendProgress(((completed + failed) / total) * 100);

          // Small delay to prevent overwhelming the API
          await new Promise((resolve) => setTimeout(resolve, 200));
        }

        setSendResult({
          success: failed === 0,
          message:
            failed === 0
              ? `Successfully sent push notifications to ${completed} delegates`
              : `Sent to ${completed} delegates, ${failed} failed`,
          count: completed,
        });
      }
    } catch (error) {
      console.error("Error sending push notifications:", error);
      setSendResult({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to send push notifications",
        count: 0,
      });
    } finally {
      setSending(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20 dark:bg-destructive/20 dark:text-destructive-foreground";
      case "normal":
        return "bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary-foreground";
      case "low":
        return "bg-muted text-muted-foreground border-muted-foreground/20";
      default:
        return "bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Recipients Summary */}
      <Card className="shadow-lg bg-muted border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-foreground flex items-center">
                <Smartphone className="h-5 w-5 mr-2 text-primary" />
                Push Notification Recipients
              </CardTitle>
              <CardDescription className="text-primary">
                {selectedDelegates.length === 0
                  ? "Broadcasting to all approved delegates' mobile devices"
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

      {/* Push Notification Composer */}
      <Card className="shadow-xl bg-background backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground flex items-center">
            <Bell className="h-6 w-6 mr-3 text-primary" />
            Push Notification Center
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Create and send professional push notifications to delegate mobile
            devices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Composition Form */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-foreground">
                    Notification Title *
                  </Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter notification title..."
                    className="border border-primary/20 focus:border-primary bg-background"
                    maxLength={50}
                  />
                  <p className="text-xs text-muted-foreground">
                    {title.length}/50 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-foreground">
                    Message Content *
                  </Label>
                  <Textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Enter your push notification message..."
                    rows={4}
                    className="border border-primary/20 focus:border-primary bg-background resize-none"
                    maxLength={200}
                  />
                  <p className="text-xs text-muted-foreground">
                    {body.length}/200 characters
                  </p>
                </div>
              </div>

              {/* Advanced Settings */}
              <Card className="border border-primary/20 bg-muted">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-foreground">
                    <Zap className="h-5 w-5 mr-2 text-primary" />
                    Advanced Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {enableSound ? (
                          <Volume2 className="h-4 w-4 text-primary" />
                        ) : (
                          <VolumeX className="h-4 w-4 text-muted-foreground" />
                        )}
                        <Label className="text-sm font-semibold text-foreground">
                          Enable Sound
                        </Label>
                      </div>
                      <Switch
                        checked={enableSound}
                        onCheckedChange={setEnableSound}
                      />
                    </div>

                    {enableSound && (
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground">
                          Sound Type
                        </Label>
                        <Select value={sound} onValueChange={setSound}>
                          <SelectTrigger className="border border-primary/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">Default</SelectItem>
                            <SelectItem value="chime">Chime</SelectItem>
                            <SelectItem value="bell">Bell</SelectItem>
                            <SelectItem value="alert">Alert</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-foreground">
                        Priority Level
                      </Label>
                      <div className="grid grid-cols-3 gap-2">
                        {["low", "normal", "high"].map((level) => (
                          <Button
                            key={level}
                            variant={priority === level ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPriority(level)}
                            className={
                              priority === level
                                ? getPriorityColor(level)
                                : "border border-primary/20 hover:bg-primary/10 bg-transparent"
                            }
                          >
                            {level === "high" && (
                              <AlertTriangle className="h-3 w-3 mr-1" />
                            )}
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-foreground">
                        Custom Data (JSON)
                      </Label>
                      <Textarea
                        value={customData}
                        onChange={(e) => setCustomData(e.target.value)}
                        placeholder='{"category": "meeting", "action": "open_app"}'
                        rows={3}
                        className="font-mono text-sm border border-primary/20 focus:border-primary bg-background"
                      />
                      <p className="text-xs text-muted-foreground">
                        Optional: Additional data to send with the notification
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Preview */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-foreground flex items-center">
                <Smartphone className="h-5 w-5 mr-2 text-primary" />
                Mobile Preview
              </Label>

              {/* Phone Mockup */}
              <div className="mx-auto max-w-sm">
                <div className="bg-muted rounded-3xl p-2 shadow-2xl">
                  <div className="bg-background rounded-2xl p-4 min-h-96">
                    {/* Status Bar */}
                    <div className="flex justify-between items-center text-muted-foreground text-xs mb-6">
                      <span>9:41</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-2 bg-muted-foreground rounded-sm"></div>
                        <div className="w-1 h-2 bg-muted-foreground rounded-sm"></div>
                        <div className="w-6 h-3 border border-muted-foreground rounded-sm">
                          <div className="w-4 h-2 bg-muted-foreground rounded-sm m-0.5"></div>
                        </div>
                      </div>
                    </div>

                    {/* Notification Preview */}
                    {(title || body) && (
                      <div className="bg-background rounded-xl p-4 mb-4 shadow-lg">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                            <Bell className="h-4 w-4 text-primary-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-semibold text-foreground truncate">
                                Shelter Afrique
                              </p>
                              <p className="text-xs text-muted-foreground">
                                now
                              </p>
                            </div>
                            {title && (
                              <p className="text-sm font-medium text-foreground mb-1">
                                {title}
                              </p>
                            )}
                            {body && (
                              <p className="text-sm text-muted-foreground line-clamp-3">
                                {body}
                              </p>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              <Badge
                                className={getPriorityColor(priority)}
                                variant="outline"
                              >
                                {priority}
                              </Badge>
                              {enableSound && (
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Volume2 className="h-3 w-3 mr-1 text-muted-foreground" />
                                  {sound}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Empty State */}
                    {!title && !body && (
                      <div className="text-center text-muted-foreground mt-20">
                        <Bell className="h-12 w-12 mx-auto mb-4 opacity-30" />
                        <p className="text-sm">
                          Enter title and message to see preview
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Send Actions */}
          <div className="flex flex-col space-y-4 pt-6 border-t border-muted">
            {sending && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Sending push notifications...
                  </span>
                  <span className="font-medium text-foreground">
                    {Math.round(sendProgress)}%
                  </span>
                </div>
                <Progress value={sendProgress} className="h-2" />
              </div>
            )}

            <Button
              onClick={handleSendPush}
              disabled={sending || !title || !body}
              className="w-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
              size="lg"
            >
              {sending ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Sending Push Notifications...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Send Push Notification{" "}
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
