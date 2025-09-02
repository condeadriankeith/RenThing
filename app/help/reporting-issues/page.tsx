import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  AlertTriangle,
  Flag,
  Shield,
  MessageCircle,
  ArrowLeft,
  CheckCircle,
  Clock,
  Phone,
  Camera,
  FileText
} from "lucide-react"

export default function ReportingIssuesPage() {
  const issueTypes = [
    {
      type: "Safety Concerns",
      priority: "High",
      icon: Shield,
      color: "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400",
      description: "Immediate safety risks or dangerous situations",
      examples: [
        "Unsafe or damaged items",
        "Threatening behavior",
        "Items used for illegal activities",
        "Safety equipment malfunctions",
        "Hazardous conditions"
      ],
      response: "Immediate action within 1 hour"
    },
    {
      type: "Fraud or Scams",
      priority: "High",
      icon: AlertTriangle,
      color: "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
      description: "Fraudulent activity or scam attempts",
      examples: [
        "Fake listings or photos",
        "Payment fraud attempts",
        "Identity theft",
        "Bait and switch tactics",
        "Off-platform payment requests"
      ],
      response: "Investigation within 2 hours"
    },
    {
      type: "Policy Violations",
      priority: "Medium",
      icon: Flag,
      color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
      description: "Violations of community guidelines",
      examples: [
        "Inappropriate content",
        "Prohibited items",
        "Spam or fake reviews",
        "Discrimination",
        "Terms of service violations"
      ],
      response: "Review within 24 hours"
    },
    {
      type: "Technical Issues",
      priority: "Medium",
      icon: MessageCircle,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
      description: "Platform bugs or technical problems",
      examples: [
        "App crashes or errors",
        "Payment processing issues",
        "Upload or photo problems",
        "Account access issues",
        "Booking system glitches"
      ],
      response: "Support within 4 hours"
    }
  ]

  const reportingSteps = [
    {
      step: 1,
      title: "Gather Information",
      description: "Collect all relevant details about the issue",
      icon: FileText,
      details: [
        "Note the date, time, and location of incident",
        "Collect usernames or listing IDs involved",
        "Take screenshots or photos if applicable",
        "Save any relevant messages or communications",
        "Document any financial impact"
      ]
    },
    {
      step: 2,
      title: "Choose Reporting Method",
      description: "Select the appropriate way to report",
      icon: Flag,
      details: [
        "Use in-app reporting for quick issues",
        "Email support for detailed reports",
        "Call emergency line for urgent safety issues",
        "Use online form for non-urgent matters",
        "Contact law enforcement if criminal activity"
      ]
    },
    {
      step: 3,
      title: "Submit Report",
      description: "Provide comprehensive details",
      icon: MessageCircle,
      details: [
        "Fill out all required fields",
        "Upload supporting evidence",
        "Provide clear, objective description",
        "Include your contact information",
        "Submit additional documents if needed"
      ]
    },
    {
      step: 4,
      title: "Follow Up",
      description: "Track progress and provide updates",
      icon: Clock,
      details: [
        "Save your report reference number",
        "Check for email updates regularly",
        "Respond to requests for additional info",
        "Cooperate with investigation process",
        "Provide feedback on resolution"
      ]
    }
  ]

  const reportingMethods = [
    {
      method: "In-App Reporting",
      icon: Flag,
      when: "Quick reports for listings or users",
      how: [
        "Go to the user's profile or listing",
        "Click the flag or report button",
        "Select the issue type",
        "Add brief description",
        "Submit immediately"
      ]
    },
    {
      method: "Email Support",
      icon: MessageCircle,
      when: "Detailed reports or complex issues",
      how: [
        "Email: support@renthing.com",
        "Include all relevant details",
        "Attach supporting documents",
        "Use clear subject line",
        "Expect response within 24 hours"
      ]
    },
    {
      method: "Emergency Hotline",
      icon: Phone,
      when: "Urgent safety or security issues",
      how: [
        "Call: +63 917 123 4567",
        "Available 24/7",
        "For immediate threats only",
        "Have your account info ready",
        "May escalate to authorities"
      ]
    }
  ]

  const evidenceTypes = [
    {
      type: "Screenshots",
      description: "Capture messages, listings, or profile information"
    },
    {
      type: "Photos",
      description: "Document damage, condition, or safety issues"
    },
    {
      type: "Messages",
      description: "Save all communications related to the issue"
    },
    {
      type: "Receipts",
      description: "Financial documents for payment issues"
    },
    {
      type: "Video",
      description: "Record evidence of item condition or behavior"
    }
  ]

  const afterReporting = [
    {
      action: "Investigation",
      description: "Our team reviews the report and evidence",
      timeline: "24-48 hours"
    },
    {
      action: "Communication",
      description: "We may contact you for additional information",
      timeline: "As needed"
    },
    {
      action: "Resolution",
      description: "Appropriate action taken based on findings",
      timeline: "3-7 days"
    },
    {
      action: "Follow-up",
      description: "Final outcome communicated to you",
      timeline: "Within 1 week"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Flag className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Reporting Issues</h1>
          <p className="text-xl text-white max-w-2xl mx-auto opacity-90">
            Keep our community safe by reporting problems, violations, and safety concerns
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Back Navigation */}
          <div className="flex items-center">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/help" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Help Center
              </Link>
            </Button>
          </div>

          {/* Emergency Notice */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">Emergency Situations</h3>
            </div>
            <p className="text-red-700 dark:text-red-300 mb-4">
              If you're in immediate danger or facing a serious safety threat, contact local emergency services first. 
              Then report the incident to us so we can take appropriate action on our platform.
            </p>
            <Button className="bg-red-600 hover:bg-red-700">
              <Phone className="w-4 h-4 mr-2" />
              Call Emergency Services (911)
            </Button>
          </div>

          {/* Issue Types */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Types of Issues to Report
            </h2>
            <div className="space-y-6">
              {issueTypes.map((issue, index) => {
                const IconComponent = issue.icon
                return (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full">
                            <IconComponent className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">{issue.type}</CardTitle>
                            <CardDescription>{issue.description}</CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={issue.color}>
                            {issue.priority} Priority
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">{issue.response}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="ml-16">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Examples to report:</h4>
                        <ul className="space-y-2">
                          {issue.examples.map((example, exampleIndex) => (
                            <li key={exampleIndex} className="flex items-start space-x-2">
                              <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">{example}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* How to Report */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              How to Report an Issue
            </h2>
            <div className="space-y-6">
              {reportingSteps.map((step, index) => {
                const IconComponent = step.icon
                return (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                          <IconComponent className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline" className="text-xs">
                              Step {step.step}
                            </Badge>
                            <CardTitle className="text-xl">{step.title}</CardTitle>
                          </div>
                          <CardDescription className="mt-2">
                            {step.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="ml-16">
                        <ul className="space-y-2">
                          {step.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="flex items-start space-x-2">
                              <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Reporting Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Reporting Methods</CardTitle>
              <CardDescription>
                Choose the best way to report based on urgency and issue type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {reportingMethods.map((method, index) => {
                  const IconComponent = method.icon
                  return (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{method.method}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{method.when}</p>
                        </div>
                      </div>
                      <ul className="space-y-1 ml-9">
                        {method.how.map((step, stepIndex) => (
                          <li key={stepIndex} className="text-sm text-gray-600 dark:text-gray-400">
                            • {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Evidence Collection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="w-6 h-6 text-blue-600 mr-2" />
                Collecting Evidence
              </CardTitle>
              <CardDescription>
                Strong evidence helps us investigate and resolve issues faster
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {evidenceTypes.map((evidence, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">{evidence.type}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{evidence.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* What Happens Next */}
          <Card>
            <CardHeader>
              <CardTitle>What Happens After You Report</CardTitle>
              <CardDescription>
                Our investigation and resolution process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {afterReporting.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{item.action}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                    </div>
                    <Badge variant="outline">{item.timeline}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Anonymous Reporting */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">Anonymous Reporting</h3>
            <p className="text-blue-700 dark:text-blue-300 mb-4">
              You can report issues anonymously, but providing your contact information helps us investigate more effectively 
              and keeps you updated on the resolution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <Link href="/contact">
                  Report an Issue
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/help/safety-guide">
                  Safety Guidelines
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}