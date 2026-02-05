import { NextResponse } from 'next/server';import { signOut } from '@/lib/auth';export async function GET(){signOut();return NextResponse.redirect(new URL('/login','http://localhost'));}
