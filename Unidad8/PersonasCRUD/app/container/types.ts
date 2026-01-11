/**
 * Types - Definiciones de tipos globales
 */

// ============================================
// DOMAIN TYPES
// ============================================

export interface IPersona {
  id: number;
  nombre: string;
  apellidos: string;
  edad: number;
  idDepartamento: number;
}

export interface IDepartamento {
  id: number;
  nombre: string;
}

// ============================================
// REPOSITORY TYPES
// ============================================

export interface IRepository<T> {
  listar(): Promise<T[]>;
  editar(id: number): Promise<T | null>;
  insertar(entity: T): Promise<boolean>;
  actualizar(entity: T): Promise<boolean>;
  eliminar(id: number): Promise<boolean>;
}

// ============================================
// USE CASE TYPES
// ============================================

export interface ICRUDUseCase<T> {
  listar(): Promise<T[]>;
  obtener(id: number): Promise<T | null>;
  crear(entity: T): Promise<boolean>;
  actualizar(entity: T): Promise<boolean>;
  eliminar(id: number): Promise<boolean>;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PersonaDTO {
  id: number;
  nombre: string;
  apellidos: string;
  edad: number;
  idDepartamento: number;
}

export interface DepartamentoDTO {
  id: number;
  nombre: string;
}

// ============================================
// VIEW MODEL TYPES
// ============================================

export interface IViewModel<T> {
  listar(): Promise<T[]>;
  obtener(id: number): Promise<T | null>;
  crear(entity: T): Promise<boolean>;
  actualizar(entity: T): Promise<boolean>;
  eliminar(id: number): Promise<boolean>;
}

// ============================================
// ESTADO DE LA APLICACIÓN
// ============================================

export enum EstadoCarga {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface EstadoUI {
  cargando: boolean;
  error: string | null;
  mensaje: string | null;
}

// ============================================
// TIPOS DE OPERACIONES CRUD
// ============================================

export enum OperacionCRUD {
  CREAR = 'CREAR',
  LEER = 'LEER',
  ACTUALIZAR = 'ACTUALIZAR',
  ELIMINAR = 'ELIMINAR',
  LISTAR = 'LISTAR'
}

// ============================================
// CONFIGURACIÓN
// ============================================

export interface ApiConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface AppConfig {
  api: ApiConfig;
  version: string;
  environment: 'development' | 'production' | 'test';
}

// ============================================
// TIPOS DE ERRORES
// ============================================

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Error de conexión') {
    super(message, 'NETWORK_ERROR', 0);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Error de validación') {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Recurso no encontrado') {
    super(message, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

// ============================================
// UTILIDADES DE TIPO
// ============================================

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type AsyncResult<T> = Promise<T>;

export type ID = number | string;

// ============================================
// TIPOS PARA FORMULARIOS
// ============================================

export interface FormField<T = string> {
  value: T;
  error: string | null;
  touched: boolean;
  valid: boolean;
}

export interface PersonaForm {
  nombre: FormField;
  apellidos: FormField;
  edad: FormField<number>;
  idDepartamento: FormField<number>;
}

export interface DepartamentoForm {
  nombre: FormField;
}

// ============================================
// TIPOS PARA NAVEGACIÓN
// ============================================

export type NavigationRoute = 
  | 'principal'
  | 'personas'
  | 'departamentos'
  | 'personasEditar'
  | 'departamentosEditar';

export interface NavigationParams {
  id?: number;
  modo?: 'crear' | 'editar';
}