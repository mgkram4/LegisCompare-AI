#!/bin/bash

# 🚀 Quick Deploy Script for Doge Legislative Analysis Platform

echo "🏛️ Doge Legislative Analysis Platform - Quick Deploy"
echo "=================================================="

echo ""
echo "✅ Your app is ready for deployment!"
echo ""

echo "📋 Next Steps:"
echo "1. Backend (Railway - Recommended):"
echo "   → Go to: https://railway.app"
echo "   → Connect this GitHub repo"
echo "   → Set OPENAI_API_KEY environment variable"
echo "   → Copy the generated backend URL"
echo ""

echo "2. Frontend (Vercel):"
echo "   → Go to: https://vercel.com" 
echo "   → Import this GitHub repo"
echo "   → Set NEXT_PUBLIC_API_URL to your backend URL"
echo "   → Deploy!"
echo ""

echo "3. Final Config:"
echo "   → Update CORS in backend/main.py with your Vercel URL"
echo "   → Test with document upload"
echo ""

echo "💰 Costs: Vercel (Free) + Railway (Free→$5/month) + OpenAI API (~$0.50-2.00 per comparison)"
echo ""

echo "📚 See deploy-checklist.md for detailed step-by-step instructions"
echo ""

# Test build
echo "🔧 Running final build test..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Build successful - ready for deployment!"
else
    echo "❌ Build failed - check for errors"
    exit 1
fi

echo ""
echo "🌍 Ready to go live! Your legislative analysis platform will be accessible worldwide."