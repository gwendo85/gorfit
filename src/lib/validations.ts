import { z } from 'zod'

export const sessionSchema = z.object({
  date: z.string().min(1, 'La date est requise'),
  objectif: z.string().min(1, 'L\'objectif est requis'),
  notes: z.string().optional(),
})

export const exerciseSchema = z.object({
  name: z.string().min(1, 'Le nom de l\'exercice est requis'),
  sets: z.number().min(1, 'Au moins 1 série requise'),
  reps: z.number().min(1, 'Au moins 1 répétition requise'),
  weight: z.number().min(0, 'Le poids doit être positif'),
  note: z.string().optional(),
})

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
})

export const signupSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  username: z.string().min(2, 'Le nom d\'utilisateur doit contenir au moins 2 caractères'),
})

export type SessionFormData = z.infer<typeof sessionSchema>
export type ExerciseFormData = z.infer<typeof exerciseSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema> 