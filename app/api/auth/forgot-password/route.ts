import { NextResponse } from "next/server"
import { sendResetEmail } from "@/lib/mail"
import { prisma } from "@/lib/prisma"
import { generateResetToken } from "@/lib/tokens"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Check if email exists
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: "If an account exists, we've sent a reset link" },
        { status: 200 }
      )
    }

    // Generate reset token
    const resetToken = await generateResetToken(user.id)

    // Send reset email
    await sendResetEmail(email, resetToken)

    return NextResponse.json({
      message: "Reset link sent successfully"
    })

  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json(
      { error: "Failed to process password reset" },
      { status: 500 }
    )
  }
}