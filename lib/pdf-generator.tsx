import type { CotizacionData } from "@/components/cotizacion-form"
import type { ResultadoCotizacion } from "@/lib/cotizacion-calculator"
import { formatCurrency, getTipoVentanaLabel, getMaterialLabel, getTipoVidrioLabel } from "@/lib/cotizacion-calculator"

export function generarPDFCotizacion(data: CotizacionData, resultado: ResultadoCotizacion) {
  // Crear contenido HTML para el PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cotización TermoPro</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 40px;
          color: #1a1a1a;
          line-height: 1.6;
        }
        .header {
          border-bottom: 3px solid #2563eb;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 10px;
        }
        .subtitle {
          color: #666;
          font-size: 14px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          font-size: 20px;
          font-weight: bold;
          color: #1a1a1a;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e5e7eb;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
        }
        .info-label {
          color: #666;
          font-size: 14px;
        }
        .info-value {
          font-weight: 600;
          color: #1a1a1a;
          font-size: 14px;
        }
        .price-section {
          background: #f0f9ff;
          padding: 20px;
          border-radius: 8px;
          border: 2px solid #2563eb;
        }
        .price-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          font-size: 15px;
        }
        .price-total {
          font-size: 24px;
          font-weight: bold;
          color: #2563eb;
          padding-top: 15px;
          border-top: 2px solid #2563eb;
          margin-top: 10px;
        }
        .discount {
          color: #059669;
        }
        .badge {
          display: inline-block;
          background: #059669;
          color: white;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          margin-left: 10px;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
          font-size: 12px;
          color: #666;
        }
        .footer-list {
          list-style: none;
          margin-top: 10px;
        }
        .footer-list li {
          padding: 4px 0;
        }
        .date {
          text-align: right;
          color: #666;
          font-size: 14px;
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">TermoPro</div>
        <div class="subtitle">Termopaneles de Alta Calidad</div>
      </div>

      <div class="date">
        Fecha: ${new Date().toLocaleDateString("es-CL", { year: "numeric", month: "long", day: "numeric" })}
      </div>

      <div class="section">
        <h2 class="section-title">Cotización de Termopaneles</h2>
      </div>

      <div class="section">
        <h3 class="section-title">Detalles del Producto</h3>
        <div class="info-grid">
          <div class="info-row">
            <span class="info-label">Tipo de Ventana:</span>
            <span class="info-value">${getTipoVentanaLabel(data.tipoVentana)}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Material del Marco:</span>
            <span class="info-value">${getMaterialLabel(data.material)}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Tipo de Vidrio:</span>
            <span class="info-value">${getTipoVidrioLabel(data.tipoVidrio)}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Dimensiones:</span>
            <span class="info-value">${data.ancho} cm × ${data.alto} cm</span>
          </div>
          <div class="info-row">
            <span class="info-label">Área por ventana:</span>
            <span class="info-value">${((data.ancho * data.alto) / 10000).toFixed(2)} m²</span>
          </div>
          <div class="info-row">
            <span class="info-label">Cantidad:</span>
            <span class="info-value">${data.cantidad} unidad(es)</span>
          </div>
          <div class="info-row">
            <span class="info-label">Área Total:</span>
            <span class="info-value">${resultado.areaTotal.toFixed(2)} m²</span>
          </div>
          <div class="info-row">
            <span class="info-label">Instalación:</span>
            <span class="info-value">${data.instalacion ? "Sí" : "No"}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <h3 class="section-title">
          Desglose de Precios
          ${resultado.descuentoPorcentaje > 0 ? `<span class="badge">${resultado.descuentoPorcentaje}% Descuento</span>` : ""}
        </h3>
        <div class="price-section">
          <div class="price-row">
            <span>Precio unitario:</span>
            <span>${formatCurrency(resultado.precioUnitario)}</span>
          </div>
          <div class="price-row">
            <span>Subtotal (${data.cantidad} unidades):</span>
            <span>${formatCurrency(resultado.precioTotal)}</span>
          </div>
          ${
            resultado.descuento > 0
              ? `
          <div class="price-row discount">
            <span>Descuento por volumen (${resultado.descuentoPorcentaje}%):</span>
            <span>-${formatCurrency(resultado.descuento)}</span>
          </div>
          `
              : ""
          }
          ${
            data.instalacion
              ? `
          <div class="price-row">
            <span>Instalación profesional:</span>
            <span>${formatCurrency(resultado.instalacion)}</span>
          </div>
          `
              : ""
          }
          <div class="price-row price-total">
            <span>Total:</span>
            <span>${formatCurrency(resultado.total)}</span>
          </div>
        </div>
      </div>

      <div class="footer">
        <h4 style="margin-bottom: 10px; color: #1a1a1a;">Información Importante</h4>
        <ul class="footer-list">
          <li>• Precios incluyen IVA</li>
          <li>• Garantía de 5 años en productos</li>
          <li>• Instalación realizada por profesionales certificados</li>
          <li>• Tiempo de entrega: 15-20 días hábiles</li>
          <li>• Cotización válida por 30 días</li>
        </ul>
        <div style="margin-top: 20px;">
          <strong>Contacto:</strong> contacto@termopro.cl | +56 9 1234 5678 | Santiago, Chile
        </div>
      </div>
    </body>
    </html>
  `

  // Crear un blob con el contenido HTML
  const blob = new Blob([htmlContent], { type: "text/html" })
  const url = URL.createObjectURL(blob)

  // Abrir en nueva ventana para imprimir/guardar como PDF
  const ventana = window.open(url, "_blank")
  if (ventana) {
    ventana.onload = () => {
      ventana.print()
      // Limpiar el URL después de un tiempo
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    }
  }
}
