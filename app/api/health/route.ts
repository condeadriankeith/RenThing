import { NextRequest, NextResponse } from "next/server"
import { edgeConfigDB } from "@/lib/edge-config/edge-config-db"
import { paymentService } from "@/lib/payment-service"
import { emailService } from "@/lib/email-service"

export async function GET(request: NextRequest) {
  try {
    const checks = await Promise.allSettled([
      // Database health check
      edgeConfigDB.findMany("health"),
      
      // Payment service health check
      paymentService.healthCheck(),
      
      // Email service health check
      emailService.healthCheck(),
      
      // Memory usage check
      Promise.resolve(process.memoryUsage()),
    ])

    const [dbCheck, paymentCheck, emailCheck, memoryCheck] = checks

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      checks: {
        database: dbCheck.status === 'fulfilled' ? 'ok' : 'error',
        paymentService: paymentCheck.status === 'fulfilled' ? 'ok' : 'error',
        emailService: emailCheck.status === 'fulfilled' ? 'ok' : 'error',
        memory: memoryCheck.status === 'fulfilled' ? 'ok' : 'error',
      },
      memory: memoryCheck.status === 'fulfilled' ? memoryCheck.value : null,
    }

    // Determine overall status
    const hasErrors = Object.values(health.checks).some(check => check === 'error')
    if (hasErrors) {
      health.status = 'degraded'
    }

    const statusCode = health.status === 'healthy' ? 200 : 503
    return NextResponse.json(health, { status: statusCode })

  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    )
  }
}