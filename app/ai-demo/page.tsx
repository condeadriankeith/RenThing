"use client";

import React, { useState } from "react";
import { RenChat } from "@/components/ai/ren-chat";
import { RenRecommendations } from "@/components/ai/ren-recommendations";
import { RenMascot } from "@/components/ai/ren-mascot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Sparkles, 
  TrendingUp, 
  Shield, 
  Zap, 
  Heart,
  Star,
  Search,
  Calendar,
  Wallet
} from "lucide-react";

export default function AIDemoPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 text-transparent bg-clip-text mb-4">
          Meet REN - Your AI Assistant
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          REN is RenThing's intelligent AI personality designed to help you find rentals, 
          manage listings, and navigate the platform with ease.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="mr-2 h-5 w-5 text-blue-500" />
              Smart Chat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Chat with REN in natural language to find rentals, get help, and manage your account.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-purple-500" />
              Personalized Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Get AI-powered suggestions based on your preferences and rental history.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
              Workflow Automation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Automate repetitive tasks like booking management and listing optimization.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-red-500" />
              System Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>REN constantly monitors the platform for bugs and improvements to ensure reliability.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="mr-2 h-5 w-5 text-yellow-500" />
              Filipino Culture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>REN speaks with a friendly, culturally-sensitive tone that resonates with Filipino users.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="mr-2 h-5 w-5 text-pink-500" />
              Engagement Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Enjoy gamified interactions, seasonal greetings, and personalized tips from REN.</p>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Demo */}
      <Tabs defaultValue="chat" className="mb-12">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat">Chat Demo</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Chat with REN</CardTitle>
              <CardDescription>
                Try asking REN questions like "Find camera rentals" or "How do I list an item?"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RenChat />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle>Personalized Recommendations</CardTitle>
              <CardDescription>
                REN learns your preferences to suggest relevant rentals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RenRecommendations />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* REN Superpowers */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="mr-2 h-5 w-5 text-yellow-500" />
            REN's Unique Superpower
          </CardTitle>
          <CardDescription>
            What makes REN special compared to other AI assistants
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Shield className="mr-2 h-5 w-5 text-blue-500" />
                System Monitoring
              </h3>
              <p className="text-gray-600 mb-4">
                REN's unique superpower is its ability to constantly monitor the entire project 
                source code for bugs, improvements, and potential failures to keep the system 
                up-to-date and prevent failures.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Badge variant="secondary" className="mr-2">✓</Badge>
                  Continuously scans GitHub repository for code quality issues
                </li>
                <li className="flex items-center">
                  <Badge variant="secondary" className="mr-2">✓</Badge>
                  Analyzes source files for potential bugs and security vulnerabilities
                </li>
                <li className="flex items-center">
                  <Badge variant="secondary" className="mr-2">✓</Badge>
                  Provides automated suggestions for code improvements
                </li>
                <li className="flex items-center">
                  <Badge variant="secondary" className="mr-2">✓</Badge>
                  Tracks technical debt and suggests refactoring opportunities
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold mb-4">How It Works</h4>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Search className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h5 className="font-medium">Code Analysis</h5>
                    <p className="text-sm text-gray-600">Scans all source files for potential issues</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h5 className="font-medium">Continuous Monitoring</h5>
                    <p className="text-sm text-gray-600">Runs periodic checks to detect new issues</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Wallet className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h5 className="font-medium">Automated Reporting</h5>
                    <p className="text-sm text-gray-600">Sends alerts and suggestions to developers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Floating Mascot */}
      <RenMascot 
        variant="floating" 
        size="md" 
        position="bottom-right" 
        onChatOpen={() => setIsChatOpen(true)} 
      />

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold">Chat with REN</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsChatOpen(false)}>
                ✕
              </Button>
            </div>
            <div className="p-4">
              <RenChat />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}