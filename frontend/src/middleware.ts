import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function decodeJwt(token: string) {
    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
        return decoded;
    } catch {
        return null;
    }
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Excluir rutas públicas (login/register/my-account)
    if (
        pathname.startsWith('/admin/login') ||
        pathname.startsWith('/admin/register') ||
        pathname.startsWith('/admin/my-acount')
    ) {
        return NextResponse.next();
    }

    // Proteger rutas /admin/**
    if (pathname.startsWith('/admin/')) {
        const token = request.cookies.get('token')?.value;
        const role = request.cookies.get('role')?.value;

        if (!token) {
            // Sin token → redirigir al login
            const loginUrl = new URL('/admin/login?unauthorized=true', request.url);
            return NextResponse.redirect(loginUrl);
        }

        const decoded = decodeJwt(token);
        if (!decoded || decoded.exp * 1000 < Date.now()) {
            const response = NextResponse.redirect(
                new URL('/admin/login?expired=true', request.url)
            );
            response.cookies.delete('token');
            response.cookies.delete('role');
            return response;
        }

        // Restricción por rol: Solo administradores pueden acceder a ciertas rutas
        const isAdminRoute =
            pathname.startsWith('/admin/sales') ||
            pathname.startsWith('/admin/products');

        // Si es una ruta de administrador y el rol no es administrador
        if (isAdminRoute && role !== 'administrador') {
            const noAccessUrl = new URL('/admin/login?noaccess=true', request.url); // Agregamos el parámetro noaccess
            return NextResponse.redirect(noAccessUrl);
        }

        return NextResponse.next();
    }

    // Cualquier otra ruta pública
    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'], // Aplica solo al área /admin
};
