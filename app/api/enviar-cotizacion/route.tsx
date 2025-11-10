import { NextResponse } from "next/server"
import type { CotizacionData } from "@/components/cotizacion-form"
import type { ResultadoCotizacion } from "@/lib/cotizacion-calculator"
import { formatCurrency, getTipoVentanaLabel, getMaterialLabel, getTipoVidrioLabel } from "@/lib/cotizacion-calculator"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, data, resultado } = body as {
      email: string
      data: CotizacionData
      resultado: ResultadoCotizacion
    }

    // Validar email
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 })
    }

    // Crear contenido del email en HTML
    const emailHTML = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .section { margin-bottom: 20px; }
          .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          .total { font-size: 24px; font-weight: bold; color: #2563eb; text-align: right; margin-top: 20px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>TermoPro</h1>
            <p>Tu Cotización de Termopaneles</p>
          </div>
          
          <div class="content">
            <div class="section">
              <h2>Detalles del Producto</h2>
              <div class="info-row">
                <span>Tipo de Ventana:</span>
                <strong>${getTipoVentanaLabel(data.tipoVentana)}</strong>
              </div>
              <div class="info-row">
                <span>Material:</span>
                <strong>${getMaterialLabel(data.material)}</strong>
              </div>
              <div class="info-row">
                <span>Tipo de Vidrio:</span>
                <strong>${getTipoVidrioLabel(data.tipoVidrio)}</strong>
              </div>
              <div class="info-row">
                <span>Dimensiones:</span>
                <strong>${data.ancho} cm × ${data.alto} cm</strong>
              </div>
              <div class="info-row">
                <span>Cantidad:</span>
                <strong>${data.cantidad} unidad(es)</strong>
              </div>
            </div>

            <div class="section">
              <h2>Resumen de Precios</h2>
              <div class="info-row">
                <span>Precio unitario:</span>
                <strong>${formatCurrency(resultado.precioUnitario)}</strong>
              </div>
              <div class="info-row">
                <span>Subtotal:</span>
                <strong>${formatCurrency(resultado.precioTotal)}</strong>
              </div>
              ${
                resultado.descuento > 0
                  ? `
              <div class="info-row" style="color: #059669;">
                <span>Descuento (${resultado.descuentoPorcentaje}%):</span>
                <strong>-${formatCurrency(resultado.descuento)}</strong>
              </div>
              `
                  : ""
              }
              ${
                data.instalacion
                  ? `
              <div class="info-row">
                <span>Instalación:</span>
                <strong>${formatCurrency(resultado.instalacion)}</strong>
              </div>
              `
                  : ""
              }
              <div class="total">
                Total: ${formatCurrency(resultado.total)}
              </div>
            </div>

            <div class="section">
              <h3>Información Importante</h3>
              <ul>
                <li>Precios incluyen IVA</li>
                <li>Garantía de 5 años</li>
                <li>Tiempo de entrega: 15-20 días hábiles</li>
                <li>Cotización válida por 30 días</li>
              </ul>
            </div>
          </div>

          <div class="footer">
            <p><strong>TermoPro</strong></p>
            <p>contacto@termopro.cl | +56 9 1234 5678</p>
            <p>Santiago, Chile</p>
          </div>
        </div>
      </body>
      </html>
    `

    // En un entorno de producción, aquí se enviaría el email usando un servicio como SendGrid, Resend, etc.
    // Por ahora, simulamos el envío exitoso
    console.log("Email que se enviaría a:", email)
    console.log("Contenido:", emailHTML)

    // Simular delay de envío
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: `Cotización enviada exitosamente a ${email}`,
    })
  } catch (error) {
    console.error("Error al enviar cotización:", error)
    return NextResponse.json({ error: "Error al enviar la cotización" }, { status: 500 })
  }
}
