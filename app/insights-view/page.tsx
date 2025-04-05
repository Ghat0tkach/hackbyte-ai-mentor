'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line
} from 'recharts';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, CheckCircle2, XCircle, AlertCircle, User, Award, TrendingUp } from "lucide-react";

// Mock data - replace with actual API call
const mockCandidateData = {
  name: "John Doe",
  position: "Frontend Developer",
  date: "2023-11-15",
  overallScore: 85,
  skills: [
    { name: "Technical Knowledge", score: 90 },
    { name: "Problem Solving", score: 85 },
    { name: "Communication", score: 80 },
    { name: "Cultural Fit", score: 88 },
    { name: "Experience", score: 75 }
  ],
  technicalBreakdown: [
    { name: "JavaScript", score: 92 },
    { name: "React", score: 88 },
    { name: "CSS", score: 75 },
    { name: "System Design", score: 70 },
    { name: "Testing", score: 65 }
  ],
  performanceOverTime: [
    { question: 1, difficulty: "Easy", score: 95, avgScore: 85 },
    { question: 2, difficulty: "Medium", score: 88, avgScore: 75 },
    { question: 3, difficulty: "Medium", score: 82, avgScore: 70 },
    { question: 4, difficulty: "Hard", score: 75, avgScore: 60 },
    { question: 5, difficulty: "Hard", score: 70, avgScore: 55 },
  ],
  feedback: "John demonstrated strong technical skills, especially in JavaScript and React. His problem-solving approach was methodical and effective. Communication was clear, though could be more concise at times. Overall, a strong candidate who would be a good fit for the team."
};

export default function InsightsView() {
  const [candidateData, setCandidateData] = useState(mockCandidateData);
  const [loading, setLoading] = useState(false);

  // Uncomment and implement when ready to fetch real data
  // useEffect(() => {
  //   const fetchCandidateInsights = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await fetch('/api/candidate-insights/123');
  //       const data = await response.json();
  //       setCandidateData(data);
  //     } catch (error) {
  //       console.error('Error fetching candidate insights:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //
  //   fetchCandidateInsights();
  // }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-lg">Loading candidate insights...</span>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 85) return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
    if (score >= 70) return <CheckCircle2 className="h-5 w-5 text-blue-600" />;
    if (score >= 60) return <AlertCircle className="h-5 w-5 text-amber-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Candidate Insights</h1>
          <p className="text-gray-500 mt-1">Comprehensive analysis of interview performance</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Badge variant="outline" className="text-sm py-1 px-3 flex items-center">
            <CalendarIcon className="h-3.5 w-3.5 mr-1" />
            {new Date(candidateData.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-500" />
              Candidate Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{candidateData.name}</p>
            <Badge className="mt-1 mb-2">{candidateData.position}</Badge>
            <Separator className="my-3" />
            <div className="flex items-center text-sm text-gray-500">
              <span>Interview completed</span>
              <span className="ml-auto font-medium">
                {new Date(candidateData.date).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Award className="h-5 w-5 mr-2 text-blue-500" />
              Overall Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mr-4 border-4 border-blue-100">
                <span className={`text-2xl font-bold ${getScoreColor(candidateData.overallScore)}`}>
                  {candidateData.overallScore}%
                </span>
              </div>
              <div>
                <p className={`text-lg font-semibold ${getScoreColor(candidateData.overallScore)}`}>
                  {candidateData.overallScore >= 85 ? 'Excellent' : 
                   candidateData.overallScore >= 70 ? 'Good' : 
                   candidateData.overallScore >= 60 ? 'Average' : 'Needs Improvement'}
                </p>
                <p className="text-sm text-gray-500 mt-1">Overall assessment</p>
              </div>
            </div>
            <Separator className="my-3" />
            <Progress 
              value={candidateData.overallScore} 
              className="h-2 mt-2" 
              indicatorClassName={
                candidateData.overallScore >= 85 ? "bg-emerald-500" : 
                candidateData.overallScore >= 70 ? "bg-blue-500" : 
                candidateData.overallScore >= 60 ? "bg-amber-500" : "bg-red-500"
              }
            />
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
              Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              {getScoreIcon(candidateData.overallScore)}
              <span className={`ml-2 text-lg font-semibold ${getScoreColor(candidateData.overallScore)}`}>
                {candidateData.overallScore >= 85 ? 'Strongly Recommend' : 
                 candidateData.overallScore >= 70 ? 'Recommend' : 
                 candidateData.overallScore >= 60 ? 'Consider' : 'Do Not Recommend'}
              </span>
            </div>
            <Separator className="my-3" />
            <div className="grid grid-cols-2 gap-2 mt-3">
              {candidateData.skills.slice(0, 4).map((skill, index) => (
                <div key={index} className="flex flex-col">
                  <span className="text-xs text-gray-500">{skill.name}</span>
                  <div className="flex items-center">
                    <Progress value={skill.score} className="h-1.5 flex-1 mr-2" />
                    <span className="text-xs font-medium">{skill.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6 grid grid-cols-3 md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="technical">Technical Skills</TabsTrigger>
          <TabsTrigger value="feedback">Detailed Feedback</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Skills Assessment</CardTitle>
                <CardDescription>Radar chart showing performance across key areas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={90} data={candidateData.skills}>
                      <PolarGrid strokeDasharray="3 3" />
                      <PolarAngleAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#6b7280' }} />
                      <Radar
                        name="Skills"
                        dataKey="score"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.6}
                      />
                      <Tooltip contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Performance Trend</CardTitle>
                <CardDescription>Performance across interview questions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={candidateData.performanceOverTime}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="question" label={{ value: 'Question Number', position: 'insideBottom', offset: -5 }} />
                      <YAxis domain={[0, 100]} label={{ value: 'Score', angle: -90, position: 'insideLeft' }} />
                      <Tooltip 
                        formatter={(value, name) => [`${value}%`, name === 'score' ? 'Candidate Score' : 'Average Score']}
                        labelFormatter={(value) => `Question ${value} (${candidateData.performanceOverTime[value-1].difficulty})`}
                        contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Candidate" />
                      <Line type="monotone" dataKey="avgScore" stroke="#9ca3af" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} name="Average" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="technical">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Technical Skills Breakdown</CardTitle>
              <CardDescription>Detailed analysis of technical competencies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={candidateData.technicalBreakdown}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#6b7280' }} />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Score']}
                      contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="score" 
                      fill="#3b82f6" 
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {candidateData.technicalBreakdown.map((skill, index) => (
                  <Card key={index} className="bg-gray-50 border-0">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{skill.name}</span>
                        <Badge 
                          variant={skill.score >= 80 ? "default" : skill.score >= 70 ? "secondary" : skill.score >= 60 ? "outline" : "destructive"}
                          className={skill.score >= 80 ? "bg-emerald-100 text-emerald-800" : 
                                    skill.score >= 70 ? "bg-blue-100 text-blue-800" : 
                                    skill.score >= 60 ? "bg-amber-100 text-amber-800" : 
                                    "bg-red-100 text-red-800"}
                        >
                          {skill.score}%
                        </Badge>
                      </div>
                      <Progress 
                        value={skill.score} 
                        className="h-2" 
                        indicatorClassName={
                          skill.score >= 80 ? "bg-emerald-500" : 
                          skill.score >= 70 ? "bg-blue-500" : 
                          skill.score >= 60 ? "bg-amber-500" : "bg-red-500"
                        }
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="feedback">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Interviewer Feedback</CardTitle>
              <CardDescription>Qualitative assessment from the interviewer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 mb-8">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{candidateData.feedback}</p>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Strengths & Areas for Improvement</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-l-4 border-l-emerald-500">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md text-emerald-600 flex items-center">
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {candidateData.skills
                          .filter(skill => skill.score >= 80)
                          .map((skill, index) => (
                            <li key={index} className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                              <span>{skill.name}</span>
                              <Badge className="ml-auto bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                                {skill.score}%
                              </Badge>
                            </li>
                          ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-l-4 border-l-amber-500">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md text-amber-600 flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        Areas for Improvement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {candidateData.skills
                          .filter(skill => skill.score < 80)
                          .map((skill, index) => (
                            <li key={index} className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                              <span>{skill.name}</span>
                              <Badge className="ml-auto bg-amber-100 text-amber-800 hover:bg-amber-100">
                                {skill.score}%
                              </Badge>
                            </li>
                          ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}