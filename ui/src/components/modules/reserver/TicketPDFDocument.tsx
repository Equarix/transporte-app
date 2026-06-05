import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ResponseSaveReserver } from "@/interface/save-reserver.interface";

interface SavedBookingData extends ResponseSaveReserver {
  originName?: string;
  destinationName?: string;
}

interface TicketPDFDocumentProps {
  data: SavedBookingData;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#333333",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 25,
    borderBottomWidth: 2,
    borderBottomColor: "#e87722",
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e87722",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: "#666666",
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#8b5a2b",
    borderBottomWidth: 1,
    borderBottomColor: "#f0e6dc",
    paddingBottom: 4,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontWeight: "bold",
    color: "#666666",
  },
  value: {
    color: "#333333",
  },
  ticketBox: {
    backgroundColor: "#f8f6f4",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2dfda",
    marginBottom: 10,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#999999",
    borderTopWidth: 1,
    borderTopColor: "#eeeeee",
    paddingTop: 10,
  },
});

export const TicketPDFDocument: React.FC<TicketPDFDocumentProps> = ({ data }) => {
  const formattedDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const totalAmount =
    (data.saleDetails?.reduce((acc, detail) => acc + (detail.amount || 0), 0) || 0) +
    (data.hotelDetails?.reduce((acc, detail) => acc + (detail.amount || 0), 0) || 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>ENTRAFESA</Text>
          <Text style={styles.subtitle}>Comprobante de Reserva de Viaje</Text>
        </View>

        {/* General Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalles de la Reserva</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Código de Transacción:</Text>
            <Text style={styles.value}>ETF-{data.saleId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Fecha de Operación:</Text>
            <Text style={styles.value}>{formattedDate(data.createdAt)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Estado de Venta:</Text>
            <Text style={styles.value}>{data.status || "APROBADO"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Canal:</Text>
            <Text style={styles.value}>{data.purchaseFrom || "WEB"}</Text>
          </View>
        </View>

        {/* Payer Info */}
        {data.salePayer && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Datos del Comprador</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Nombre Completo:</Text>
              <Text style={styles.value}>{data.salePayer.names}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Documento de Identidad:</Text>
              <Text style={styles.value}>
                {data.salePayer.documentType} {data.salePayer.documentNumber}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Correo Electrónico:</Text>
              <Text style={styles.value}>{data.salePayer.email}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Teléfono de Contacto:</Text>
              <Text style={styles.value}>{data.salePayer.phone}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Método de Pago:</Text>
              <Text style={styles.value}>
                {data.salePayer.providerMethod} ({data.salePayer.typeMethod})
              </Text>
            </View>
          </View>
        )}

        {/* Travel Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalles de Ruta</Text>
          <View style={styles.ticketBox}>
            <View style={styles.row}>
              <Text style={styles.label}>Origen:</Text>
              <Text style={styles.value}>{data.originName || "TRUJILLO"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Destino:</Text>
              <Text style={styles.value}>{data.destinationName || "LIMA"}</Text>
            </View>
          </View>
        </View>

        {/* Passengers / Seats */}
        {data.saleDetails && data.saleDetails.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pasajeros y Asientos</Text>
            {data.saleDetails.map((detail, idx) => (
              <View
                key={idx}
                style={{
                  marginBottom: 6,
                  paddingBottom: 6,
                  borderBottomWidth: 1,
                  borderBottomColor: "#f2f2f2",
                }}
              >
                <View style={styles.row}>
                  <Text style={styles.label}>Pasajero:</Text>
                  <Text style={styles.value}>{detail.name}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Documento:</Text>
                  <Text style={styles.value}>
                    {detail.documentType} {detail.documentNumber}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Ubicación:</Text>
                  <Text style={styles.value}>
                    Piso {detail.floor} - Asiento {detail.row}-{detail.column} ({detail.typeSeat})
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Monto Pasaje:</Text>
                  <Text style={styles.value}>S/ {(detail.amount || 0).toFixed(2)}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Hotel Details */}
        {data.hotelDetails && data.hotelDetails.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Estancia en Hotel</Text>
            {data.hotelDetails.map((hotel, idx) => (
              <View key={idx} style={styles.ticketBox}>
                <View style={styles.row}>
                  <Text style={styles.label}>Hotel:</Text>
                  <Text style={styles.value}>{hotel.hotelName}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Huésped principal:</Text>
                  <Text style={styles.value}>{hotel.clientName}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Entrada (Check-in):</Text>
                  <Text style={styles.value}>{hotel.checkIn}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Salida (Check-out):</Text>
                  <Text style={styles.value}>{hotel.checkOut}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Monto Alojamiento:</Text>
                  <Text style={styles.value}>S/ {(hotel.amount || 0).toFixed(2)}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
        {/* Sales Points */}
        {data.salesPoints && (
          <View style={{ ...styles.ticketBox, backgroundColor: "#fdf5f0", borderColor: "#f0e6dc" }}>
            <View style={styles.row}>
              <Text style={{ ...styles.label, color: "#8b5a2b" }}>Puntos Entrafesa Ganados:</Text>
              <Text style={{ ...styles.value, fontWeight: "bold", color: "#e87722" }}>
                +{data.salesPoints.points} pts
              </Text>
            </View>
          </View>
        )}

        {/* Pricing Total */}
        <View
          style={{
            ...styles.section,
            marginTop: 15,
            borderTopWidth: 1.5,
            borderTopColor: "#e87722",
            paddingTop: 10,
          }}
        >
          <View style={styles.row}>
            <Text style={{ ...styles.label, fontSize: 12 }}>Total Pagado:</Text>
            <Text
              style={{
                ...styles.value,
                fontSize: 14,
                fontWeight: "bold",
                color: "#e87722",
              }}
            >
              S/ {totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Gracias por su preferencia. Presente este documento digital o impreso al embarcar.</Text>
          <Text>TRANSPORTES ENTRAFESA S.A. | RUC: 20100078512 | Central: (044) 282424</Text>
        </View>
      </Page>
    </Document>
  );
};
